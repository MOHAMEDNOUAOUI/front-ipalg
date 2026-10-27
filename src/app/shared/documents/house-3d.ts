import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type * as THREE from 'three';
import { Row } from '../../modules/module.types';
import { footprint, templateFor } from './plan-templates';

const H = 3.2;
const NAVY = 0x043d6d;
const TEAL = 0x06adb9;

interface Picked {
  name: string;
  area: number;
  floor: string;
}

/** Interactive 3D model of a property, built from the same room layout as its drawn plan. */
@Component({
  selector: 'app-house-3d',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view" #host></div>

    @if (loading()) {
      <p class="state">Chargement de la maquette…</p>
    } @else if (failed()) {
      <p class="state">La maquette 3D n’a pas pu démarrer sur ce navigateur.</p>
    } @else {
      <div class="tools" role="group" aria-label="Options de la maquette">
        @if (floors() > 1) {
          <div class="seg" role="group" aria-label="Étage affiché">
            <button type="button" [class.on]="shown() === 'all'" (click)="showFloor('all')">Tous</button>
            @for (f of floorList(); track f) {
              <button type="button" [class.on]="shown() === f" (click)="showFloor(f)">{{ f === 0 ? 'RDC' : 'R+' + f }}</button>
            }
          </div>
        }
        @if (!land()) {
          <button type="button" class="tg" [class.on]="roof()" (click)="toggleRoof()">Toit</button>
          @if (floors() > 1) {
            <button type="button" class="tg" [class.on]="explode()" (click)="toggleExplode()">Éclater</button>
          }
        }
        <button type="button" class="tg" (click)="resetView()">Réinitialiser</button>
      </div>

      @if (picked(); as p) {
        <div class="info" role="status">
          <strong>{{ p.name }}</strong>
          <span>{{ p.area }} m² · {{ p.floor }}</span>
        </div>
      } @else {
        <span class="tip">Glisser pour tourner · molette pour zoomer{{ land() ? '' : ' · clic sur une pièce' }}</span>
      }
    }
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      display: block;
    }
    .view {
      position: absolute;
      inset: 0;
      cursor: grab;
      touch-action: none;
    }
    .view:active {
      cursor: grabbing;
    }
    .state {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: var(--ink-3);
      font-size: 13.5px;
    }
    .tools {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      pointer-events: none;
    }
    .tools > * {
      pointer-events: auto;
    }
    .seg {
      display: inline-flex;
      padding: 3px;
      border-radius: 10px;
      background: var(--surface);
      border: 1px solid var(--line);
    }
    .seg button {
      height: 28px;
      padding: 0 11px;
      border-radius: 7px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--ink-2);
      cursor: pointer;
    }
    .seg button.on {
      background: var(--brand-dark);
      color: #fff;
    }
    .tg {
      height: 36px;
      padding: 0 14px;
      border-radius: 10px;
      border: 1px solid var(--line);
      background: var(--surface);
      font-size: 12.5px;
      font-weight: 600;
      color: var(--ink-2);
      cursor: pointer;
    }
    .tg.on {
      border-color: var(--brand-mid);
      background: var(--brand-tint);
      color: var(--brand-dark);
    }
    .tg:hover,
    .seg button:hover:not(.on) {
      background: var(--surface-sunken);
    }
    button:focus-visible {
      outline: 2px solid var(--brand-mid);
      outline-offset: 2px;
    }
    .info {
      position: absolute;
      left: 14px;
      bottom: 14px;
      display: flex;
      flex-direction: column;
      padding: 9px 13px;
      border-radius: 10px;
      background: #14202b;
      color: #fff;
      font-size: 12.5px;
      pointer-events: none;
    }
    .info strong {
      font-size: 14px;
    }
    .info span {
      color: #9db0c2;
    }
    .tip {
      position: absolute;
      left: 14px;
      bottom: 14px;
      font-size: 12px;
      color: var(--ink-3);
      pointer-events: none;
    }
  `,
})
export class House3d {
  readonly row = input.required<Row>();

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly zone = inject(NgZone);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly shown = signal<'all' | number>('all');
  protected readonly roof = signal(true);
  protected readonly explode = signal(false);
  protected readonly picked = signal<Picked | null>(null);

  protected readonly land = computed(() => String(this.row()['nature']) === 'Terrain');
  protected readonly floors = computed(() => (this.land() ? 1 : footprint(Number(this.row()['surface']) || 300, String(this.row()['nature'])).floors));
  protected readonly floorList = computed(() => Array.from({ length: this.floors() }, (_, i) => i));

  private three!: typeof THREE;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: { update(): boolean; dispose(): void; target: THREE.Vector3; autoRotate: boolean; reset(): void; saveState(): void; addEventListener(t: string, f: () => void): void };
  private floorGroups: THREE.Group[] = [];
  private roofGroup?: THREE.Group;
  private pickables: THREE.Mesh[] = [];
  private frame = 0;
  private offsets: number[] = [];
  private selected?: THREE.Mesh;
  private disposed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
    effect(() => {
      // Rebuild the model when another property is opened.
      const r = this.row();
      void r;
      if (this.three) this.zone.runOutsideAngular(() => this.build());
    });
    afterNextRender(() => void this.start());
  }

  protected showFloor(f: 'all' | number) {
    this.shown.set(f);
    this.picked.set(null);
    this.applyVisibility();
  }

  protected toggleRoof() {
    this.roof.update((v) => !v);
    this.applyVisibility();
  }

  protected toggleExplode() {
    this.explode.update((v) => !v);
  }

  protected resetView() {
    this.controls?.reset();
    this.picked.set(null);
  }

  private async start() {
    try {
      const three = await import('three');
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
      if (this.disposed) return;
      this.three = three;
      this.zone.runOutsideAngular(() => {
        const el = this.host().nativeElement;
        const renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = three.PCFSoftShadowMap;
        el.appendChild(renderer.domElement);
        this.renderer = renderer;
        this.scene = new three.Scene();
        this.camera = new three.PerspectiveCamera(32, 1, 0.5, 1000);
        const controls = new OrbitControls(this.camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.7;
        controls.maxPolarAngle = Math.PI / 2 - 0.04;
        controls.addEventListener('start', () => (controls.autoRotate = false));
        this.controls = controls as unknown as typeof this.controls;

        const ro = new ResizeObserver(() => this.resize());
        ro.observe(el);
        this.cleanup.push(() => ro.disconnect());

        let down: [number, number] | null = null;
        const c = renderer.domElement;
        const onDown = (e: PointerEvent) => (down = [e.clientX, e.clientY]);
        const onUp = (e: PointerEvent) => {
          if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 5) this.pick(e);
          down = null;
        };
        c.addEventListener('pointerdown', onDown);
        c.addEventListener('pointerup', onUp);
        this.cleanup.push(() => {
          c.removeEventListener('pointerdown', onDown);
          c.removeEventListener('pointerup', onUp);
        });

        this.build();
        this.resize();
        const loop = () => {
          this.frame = requestAnimationFrame(loop);
          this.tick();
        };
        loop();
      });
      this.loading.set(false);
    } catch {
      this.loading.set(false);
      this.failed.set(true);
    }
  }

  private cleanup: (() => void)[] = [];

  private resize() {
    const el = this.host().nativeElement;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h || !this.renderer || !this.camera) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private tick() {
    if (!this.renderer || !this.scene || !this.camera) return;
    const gap = this.explode() ? 5 : 0;
    this.floorGroups.forEach((g, i) => {
      const target = i * gap;
      this.offsets[i] += (target - this.offsets[i]) * 0.12;
      g.position.y = this.offsets[i];
    });
    if (this.roofGroup) {
      const top = this.floorGroups.length;
      this.roofGroup.position.y = (top - 1) * (this.explode() ? 5 : 0) + 0;
    }
    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
  }

  private applyVisibility() {
    const s = this.shown();
    this.floorGroups.forEach((g, i) => (g.visible = s === 'all' || i <= s));
    if (this.roofGroup) this.roofGroup.visible = this.roof() && (s === 'all' || s === this.floorGroups.length - 1);
  }

  private pick(e: PointerEvent) {
    if (!this.renderer || !this.camera || this.land()) return;
    const T = this.three;
    const box = this.renderer.domElement.getBoundingClientRect();
    const ndc = new T.Vector2(((e.clientX - box.left) / box.width) * 2 - 1, -((e.clientY - box.top) / box.height) * 2 + 1);
    const ray = new T.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hits = ray.intersectObjects(this.pickables.filter((m) => m.parent?.visible), false);
    this.zone.run(() => {
      if (this.selected) (this.selected.material as THREE.MeshStandardMaterial).color.setHex(0xf3f6fa);
      const hit = hits[0]?.object as THREE.Mesh | undefined;
      this.selected = hit;
      if (!hit) {
        this.picked.set(null);
        return;
      }
      (hit.material as THREE.MeshStandardMaterial).color.setHex(TEAL);
      const d = hit.userData as { name: string; area: number; floor: number };
      this.picked.set({ name: d.name, area: d.area, floor: d.floor === 0 ? 'Rez-de-chaussée' : `Étage ${d.floor}` });
    });
  }

  private build() {
    const T = this.three;
    const scene = this.scene!;
    scene.clear();
    this.floorGroups = [];
    this.pickables = [];
    this.selected = undefined;
    this.picked.set(null);
    this.shown.set('all');

    const r = this.row();
    const nature = String(r['nature']);
    const surface = Number(r['surface']) || 300;
    const isLand = nature === 'Terrain';
    const { floors, wM, dM } = isLand ? { floors: 1, wM: Math.sqrt(surface * 1.5), dM: surface / Math.sqrt(surface * 1.5) } : footprint(surface, nature);
    const span = Math.max(wM, dM, floors * H * 1.6);

    const mat = (c: number, o: Partial<THREE.MeshStandardMaterialParameters> = {}) => new T.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, ...o });
    const line = new T.LineBasicMaterial({ color: 0x14202b, transparent: true, opacity: 0.55 });
    const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, edges = true) => {
      const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), m);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (edges) mesh.add(new T.LineSegments(new T.EdgesGeometry(mesh.geometry), line));
      return mesh;
    };

    // Light
    scene.add(new T.HemisphereLight(0xffffff, 0xc9d3de, 1.0));
    const sun = new T.DirectionalLight(0xffffff, 1.6);
    sun.position.set(span * 0.8, span * 1.1, span * 0.6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const s = span * 1.2;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: span * 4 });
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    // Ground and plot
    const bg = new T.Color(getComputedStyle(this.host().nativeElement).getPropertyValue('--surface-sunken').trim() || '#f1f6fb');
    const ground = new T.Mesh(new T.CircleGeometry(span * 9, 64), new T.MeshBasicMaterial({ color: bg }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.32;
    scene.add(ground);
    const shade = new T.Mesh(new T.CircleGeometry(span * 3, 64), new T.ShadowMaterial({ opacity: 0.14 }));
    shade.rotation.x = -Math.PI / 2;
    shade.position.y = -0.3;
    shade.receiveShadow = true;
    scene.add(shade);
    scene.add(box(wM + (isLand ? 0 : 10), 0.3, dM + (isLand ? 0 : 10), isLand ? new T.MeshBasicMaterial({ color: 0xdbe7e1 }) : mat(0xdde5ee), 0, -0.15, 0));

    if (isLand) {
      const corners: [number, number][] = [[-wM / 2, -dM / 2], [wM / 2, -dM / 2], [wM / 2, dM / 2], [-wM / 2, dM / 2]];
      const pts = corners.map(([x, z]) => new T.Vector3(x, 0.05, z));
      scene.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: NAVY })));
      corners.forEach(([x, z], i) => {
        const post = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 1.6, 16), mat(NAVY));
        post.position.set(x, 0.8, z);
        post.castShadow = true;
        scene.add(post);
        const lab = this.label(`B${i + 1}`);
        lab.position.set(x, 2.6, z);
        lab.scale.set(8, 2, 1);
        scene.add(lab);
      });
      const ghost = new T.Mesh(new T.BoxGeometry(wM * 0.55, 8, dM * 0.45), mat(TEAL, { transparent: true, opacity: 0.28 }));
      ghost.position.set(0, 4, 0);
      ghost.add(new T.LineSegments(new T.EdgesGeometry(ghost.geometry), new T.LineBasicMaterial({ color: TEAL })));
      scene.add(ghost);
      const note = this.label('Emprise constructible (démo)');
      note.position.set(0, 10.5, 0);
      note.scale.set(wM * 0.6, wM * 0.6 * 0.125, 1);
      scene.add(note);
    } else {
      const tpl = templateFor(nature);
      const wallH = H - 0.25;
      const wallMat = mat(0xf8fafc);
      const slabMat = mat(0xc9d3de);
      const glass = mat(0x7fd3da, { transparent: true, opacity: 0.6, roughness: 0.2 });
      const doorMat = mat(NAVY);
      const eps = 0.001;

      for (let f = 0; f < floors; f++) {
        const g = new T.Group();
        const y0 = f * H;
        g.add(box(wM + 0.4, 0.25, dM + 0.4, slabMat, 0, y0 - 0.125, 0, false));
        const done = new Set<string>();
        const edge = (x1: number, z1: number, x2: number, z2: number, outer: boolean) => {
          const key = [x1, z1, x2, z2].map((v) => Math.round(v * 100)).join(',');
          if (done.has(key)) return;
          done.add(key);
          const th = outer ? 0.3 : 0.16;
          if (Math.abs(z1 - z2) < 1e-6) {
            g.add(box(Math.abs(x2 - x1) + th, wallH, th, wallMat, (x1 + x2) / 2, y0 + wallH / 2, z1));
          } else {
            g.add(box(th, wallH, Math.abs(z2 - z1) + th, wallMat, x1, y0 + wallH / 2, (z1 + z2) / 2));
          }
        };

        tpl.forEach((t, i) => {
          const x1 = (t.x - 0.5) * wM;
          const x2 = (t.x + t.w - 0.5) * wM;
          const z1 = (t.y - 0.5) * dM;
          const z2 = (t.y + t.h - 0.5) * dM;
          const area = Math.round(t.w * wM * t.h * dM);

          const tile = box(x2 - x1 - 0.3, 0.06, z2 - z1 - 0.3, mat(0xf3f6fa), (x1 + x2) / 2, y0 + 0.03, (z1 + z2) / 2, false);
          tile.userData = { name: t.n, area, floor: f };
          g.add(tile);
          this.pickables.push(tile);

          const top = t.y < eps;
          const bottom = t.y + t.h > 1 - eps;
          const left = t.x < eps;
          const right = t.x + t.w > 1 - eps;
          edge(x1, z1, x2, z1, top);
          edge(x1, z2, x2, z2, bottom);
          edge(x1, z1, x1, z2, left);
          edge(x2, z1, x2, z2, right);

          const win = (cx: number, cz: number, len: number, alongX: boolean) => {
            const wl = Math.min(len * 0.5, 3);
            g.add(box(alongX ? wl : 0.36, 1.3, alongX ? 0.36 : wl, glass, cx, y0 + 1.7, cz));
          };
          if (top && x2 - x1 > 2.2) win((x1 + x2) / 2, z1, x2 - x1, true);
          if (bottom && x2 - x1 > 2.2) win((x1 + x2) / 2, z2, x2 - x1, true);
          if (left && z2 - z1 > 2.2) win(x1, (z1 + z2) / 2, z2 - z1, false);
          if (right && z2 - z1 > 2.2) win(x2, (z1 + z2) / 2, z2 - z1, false);
          if (f === 0 && bottom && left && i === tpl.findIndex((q) => q.y + q.h > 1 - eps)) {
            g.add(box(1.5, 2.4, 0.4, doorMat, x1 + Math.min(2, (x2 - x1) / 2), y0 + 1.2, z2));
          }
        });
        this.offsets[f] = 0;
        this.floorGroups.push(g);
        scene.add(g);
      }

      const rg = new T.Group();
      rg.add(box(wM + 0.8, 0.4, dM + 0.8, mat(0xaab6c3), 0, floors * H - 0.05, 0));
      rg.add(box(wM * 0.12, 0.8, dM * 0.12, mat(0x8a9bb0), wM * 0.28, floors * H + 0.5, -dM * 0.2));
      this.roofGroup = rg;
      scene.add(rg);

      // A few trees for scale
      const tree = (x: number, z: number, h: number) => {
        const t = new T.Group();
        const trunk = new T.Mesh(new T.CylinderGeometry(0.18, 0.25, h * 0.4, 8), mat(0x8a7a6a));
        trunk.position.y = h * 0.2;
        const crown = new T.Mesh(new T.IcosahedronGeometry(h * 0.32, 1), mat(0x9fc7b3));
        crown.position.y = h * 0.62;
        crown.castShadow = true;
        trunk.castShadow = true;
        t.add(trunk, crown);
        t.position.set(x, 0, z);
        scene.add(t);
      };
      tree(-wM / 2 - 3.2, dM / 2 + 2.6, 5);
      tree(wM / 2 + 3.4, dM / 2 + 2.2, 4.2);
      tree(-wM / 2 - 3, -dM / 2 - 2.5, 4.6);
    }

    this.applyVisibility();
    const cam = this.camera!;
    cam.near = 0.5;
    cam.far = span * 12;
    const k = isLand ? 0.85 : 1;
    cam.position.set(span * 1.5 * k, span * 1.1 * k, span * 2.0 * k);
    const c = this.controls!;
    c.target.set(0, isLand ? 2 : (floors * H) / 2.6, 0);
    Object.assign(c, { minDistance: span * 0.8, maxDistance: span * 5 });
    cam.lookAt(c.target);
    c.update();
    c.saveState();
    c.autoRotate = true;
  }

  private label(text: string): THREE.Sprite {
    const T = this.three;
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 128;
    const g = cv.getContext('2d')!;
    g.fillStyle = 'rgba(20,32,43,0.9)';
    g.beginPath();
    g.roundRect(8, 24, 496, 80, 24);
    g.fill();
    g.fillStyle = '#fff';
    let size = 44;
    g.font = `600 ${size}px DM Sans, sans-serif`;
    while (g.measureText(text).width > 450 && size > 14) {
      size -= 2;
      g.font = `600 ${size}px DM Sans, sans-serif`;
    }
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 256, 66);
    const tex = new T.CanvasTexture(cv);
    tex.colorSpace = T.SRGBColorSpace;
    return new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false }));
  }

  private dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.cleanup.forEach((f) => f());
    this.controls?.dispose();
    this.scene?.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mt = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mt) ? mt : mt ? [mt] : []).forEach((x) => x.dispose());
    });
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }
}
