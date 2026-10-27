import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type * as THREE from 'three';

/** Extensions the viewer can open, lower case and without the dot. */
export const MODEL_EXT = ['glb', 'gltf', 'obj', 'stl', 'ply', 'fbx'];

export function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i + 1).toLowerCase();
}

type Controls = {
  update(): boolean;
  dispose(): void;
  target: THREE.Vector3;
  autoRotate: boolean;
  reset(): void;
  saveState(): void;
  addEventListener(t: string, f: () => void): void;
};

/** Opens a 3D file chosen by the user (GLB, GLTF, OBJ, STL, PLY, FBX) and lets them orbit around it. */
@Component({
  selector: 'app-model-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view" #host></div>

    @if (error(); as e) {
      <p class="state err" role="alert">{{ e }}</p>
    } @else if (loading()) {
      <p class="state">Chargement du modèle{{ progress() ? ' · ' + progress() + ' %' : '…' }}</p>
    } @else {
      <div class="tools" role="group" aria-label="Options du modèle">
        <button type="button" class="tg" (click)="resetView()">Réinitialiser</button>
        <button type="button" class="tg" [class.on]="wire()" (click)="toggleWire()">Fil de fer</button>
        <button type="button" class="tg" [class.on]="grid()" (click)="toggleGrid()">Grille</button>
        <button type="button" class="tg" [class.on]="spin()" (click)="toggleSpin()">Rotation</button>
        <button type="button" class="tg" [class.on]="zUp()" (click)="toggleZUp()" title="Si le modèle est couché, inversez l’axe vertical">Axe Z haut</button>
        @if (clips() > 0) {
          <button type="button" class="tg" [class.on]="play()" (click)="togglePlay()">Animation</button>
        }
      </div>
      <div class="info" role="status">
        <strong>{{ name() }}</strong>
        <span>{{ stats() }}</span>
      </div>
      <span class="tip">Glisser pour tourner · clic droit pour déplacer · molette pour zoomer</span>
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
      padding: 24px;
      text-align: center;
      color: var(--ink-3);
      font-size: 13.5px;
    }
    .state.err {
      color: var(--danger-ink);
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
    .tg {
      pointer-events: auto;
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
    .tg:hover {
      background: var(--surface-sunken);
    }
    .tg.on {
      border-color: var(--brand-mid);
      background: var(--brand-tint);
      color: var(--brand-dark);
    }
    .tg:focus-visible {
      outline: 2px solid var(--brand-mid);
      outline-offset: 2px;
    }
    .info {
      position: absolute;
      left: 14px;
      bottom: 38px;
      display: flex;
      flex-direction: column;
      max-width: calc(100% - 28px);
      padding: 9px 13px;
      border-radius: 10px;
      background: #14202b;
      color: #fff;
      font-size: 12.5px;
      pointer-events: none;
    }
    .info strong {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
export class ModelViewer {
  /** Object URL (or any URL) of the main file. */
  readonly url = input.required<string>();
  readonly name = input.required<string>();
  /** Lower-case extension, for example `glb`. */
  readonly ext = input.required<string>();
  /** Files a .gltf points to (bin, textures), by file name. */
  readonly resources = input<Record<string, string>>({});

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly zone = inject(NgZone);

  protected readonly loading = signal(true);
  protected readonly progress = signal(0);
  protected readonly error = signal<string | null>(null);
  protected readonly stats = signal('');
  protected readonly wire = signal(false);
  protected readonly grid = signal(true);
  protected readonly spin = signal(true);
  protected readonly zUp = signal(false);
  protected readonly play = signal(true);
  protected readonly clips = signal(0);

  private T!: typeof THREE;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: Controls;
  private pivot?: THREE.Group;
  private gridHelper?: THREE.GridHelper;
  private mixer?: THREE.AnimationMixer;
  private clock?: THREE.Clock;
  private materials = new Set<THREE.Material>();
  private frame = 0;
  private disposed = false;
  private cleanup: (() => void)[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
    afterNextRender(() => void this.start());
  }

  protected resetView() {
    this.controls?.reset();
  }

  protected toggleWire() {
    this.wire.update((v) => !v);
    this.materials.forEach((m) => ((m as THREE.MeshBasicMaterial).wireframe = this.wire()));
  }

  protected toggleGrid() {
    this.grid.update((v) => !v);
    if (this.gridHelper) this.gridHelper.visible = this.grid();
  }

  protected toggleSpin() {
    this.spin.update((v) => !v);
    if (this.controls) this.controls.autoRotate = this.spin();
  }

  protected toggleZUp() {
    this.zUp.update((v) => !v);
    this.place();
  }

  protected togglePlay() {
    this.play.update((v) => !v);
  }

  private async start() {
    try {
      const T = await import('three');
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
      const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
      if (this.disposed) return;
      this.T = T;

      const el = this.host().nativeElement;
      this.zone.runOutsideAngular(() => {
        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFSoftShadowMap;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        el.appendChild(renderer.domElement);
        this.renderer = renderer;

        const scene = new T.Scene();
        scene.environment = new T.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
        const sun = new T.DirectionalLight(0xffffff, 1.4);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        scene.add(sun, new T.HemisphereLight(0xffffff, 0xb8c4cf, 0.5));
        this.scene = scene;
        this.sun = sun;

        this.camera = new T.PerspectiveCamera(35, 1, 0.01, 1000);
        const controls = new OrbitControls(this.camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.addEventListener('start', () => {
          controls.autoRotate = false;
          this.zone.run(() => this.spin.set(false));
        });
        this.controls = controls as unknown as Controls;

        const ro = new ResizeObserver(() => this.resize());
        ro.observe(el);
        this.cleanup.push(() => ro.disconnect());
      });

      const object = await this.read(T);
      if (this.disposed) return;
      this.zone.runOutsideAngular(() => {
        this.mount(object);
        this.resize();
        this.clock = new T.Clock();
        const loop = () => {
          this.frame = requestAnimationFrame(loop);
          this.tick();
        };
        loop();
      });
      this.loading.set(false);
    } catch (e) {
      if (this.disposed) return;
      this.error.set(this.explain(e));
      this.loading.set(false);
    }
  }

  private sun?: THREE.DirectionalLight;
  private clipsList: THREE.AnimationClip[] = [];

  private explain(e: unknown): string {
    if (this.ext() === 'gltf' && !Object.keys(this.resources()).length) {
      return 'Ce fichier .gltf dépend d’autres fichiers (.bin, textures). Ajoutez-les en même temps, ou utilisez un fichier .glb.';
    }
    const msg = e instanceof Error ? e.message : '';
    return `Ce fichier n’a pas pu être ouvert${msg ? ' (' + msg.slice(0, 120) + ')' : ''}. Formats pris en charge : GLB, GLTF, OBJ, STL, PLY, FBX.`;
  }

  /** Reads the file with the loader that matches its extension. */
  private async read(T: typeof THREE): Promise<THREE.Object3D> {
    const url = this.url();
    const ext = this.ext();
    const manager = new T.LoadingManager();
    const files = this.resources();
    if (Object.keys(files).length) {
      manager.setURLModifier((u) => {
        const key = decodeURIComponent(u.split('/').pop() ?? '').split('?')[0];
        return files[key] ?? u;
      });
    }
    const onProgress = (e: ProgressEvent) => {
      if (e.lengthComputable) this.zone.run(() => this.progress.set(Math.round((e.loaded / e.total) * 100)));
    };

    if (ext === 'glb' || ext === 'gltf') {
      const [{ GLTFLoader }, { DRACOLoader }, { MeshoptDecoder }] = await Promise.all([
        import('three/addons/loaders/GLTFLoader.js'),
        import('three/addons/loaders/DRACOLoader.js'),
        import('three/addons/libs/meshopt_decoder.module.js'),
      ]);
      const draco = new DRACOLoader(manager).setDecoderPath('draco/');
      const loader = new GLTFLoader(manager).setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync(url, onProgress);
      draco.dispose();
      this.clipsList = gltf.animations;
      return gltf.scene;
    }
    if (ext === 'fbx' || Object.keys(files).some((k) => k.toLowerCase().endsWith('.tga'))) {
      const { TGALoader } = await import('three/addons/loaders/TGALoader.js');
      manager.addHandler(/\.tga$/i, new TGALoader(manager));
    }
    if (ext === 'obj') {
      const [{ OBJLoader }, { MTLLoader }] = await Promise.all([
        import('three/addons/loaders/OBJLoader.js'),
        import('three/addons/loaders/MTLLoader.js'),
      ]);
      const loader = new OBJLoader(manager);
      const mtl = Object.keys(files).find((k) => k.toLowerCase().endsWith('.mtl'));
      if (mtl) {
        try {
          const materials = await new MTLLoader(manager).loadAsync(files[mtl]);
          materials.preload();
          loader.setMaterials(materials);
        } catch {
          /* a broken .mtl should not stop the shape from showing */
        }
      }
      return loader.loadAsync(url, onProgress);
    }
    if (ext === 'fbx') {
      const { FBXLoader } = await import('three/addons/loaders/FBXLoader.js');
      const fbx = await new FBXLoader(manager).loadAsync(url, onProgress);
      this.clipsList = fbx.animations;
      return fbx;
    }
    if (ext === 'stl' || ext === 'ply') {
      const geo =
        ext === 'stl'
          ? await new (await import('three/addons/loaders/STLLoader.js')).STLLoader(manager).loadAsync(url, onProgress)
          : await new (await import('three/addons/loaders/PLYLoader.js')).PLYLoader(manager).loadAsync(url, onProgress);
      if (!geo.getAttribute('normal')) geo.computeVertexNormals();
      const colored = !!geo.getAttribute('color');
      return new T.Mesh(
        geo,
        new T.MeshStandardMaterial({ color: colored ? 0xffffff : 0xc9d6e2, vertexColors: colored, roughness: 0.6, metalness: 0.05 })
      );
    }
    throw new Error(`format .${ext} non pris en charge`);
  }

  /** Adds the model to the scene, then measures it. */
  private mount(object: THREE.Object3D) {
    const T = this.T;
    const pivot = new T.Group();
    pivot.add(object);
    this.pivot = pivot;
    this.scene!.add(pivot);

    this.plain(object);

    let tris = 0;
    object.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = m.receiveShadow = true;
      const g = m.geometry;
      tris += (g.index ? g.index.count : (g.getAttribute('position')?.count ?? 0)) / 3;
      const list = Array.isArray(m.material) ? m.material : [m.material];
      list.forEach((mat) => this.materials.add(mat));
      // Models exported without normals or with back faces missing still need to read as solid.
      if (!g.getAttribute('normal')) g.computeVertexNormals();
    });
    this.materials.forEach((mat) => {
      const s = mat as THREE.MeshStandardMaterial;
      if (s.envMapIntensity !== undefined) s.envMapIntensity = 0.9;
    });

    if (this.clipsList.length) {
      this.mixer = new T.AnimationMixer(object);
      this.mixer.clipAction(this.clipsList[0]).play();
      this.clips.set(this.clipsList.length);
    }

    this.place();
    this.stats.set(`${this.dimsText()} · ${Math.round(tris).toLocaleString('fr-FR')} triangles`);
  }

  /** Meshes with no texture or vertex colours (most OBJ and STL files) get one clear material and outlined edges. */
  private plain(object: THREE.Object3D) {
    const T = this.T;
    object.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const first = (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;
      if (first.map || first.vertexColors) return;
      m.material = new T.MeshStandardMaterial({ color: 0x8fb0cc, roughness: 0.55, metalness: 0.05, side: T.DoubleSide });
      const edges = new T.LineSegments(
        new T.EdgesGeometry(m.geometry, 25),
        new T.LineBasicMaterial({ color: 0x043d6d, transparent: true, opacity: 0.6 })
      );
      m.add(edges);
      this.cleanup.push(() => {
        edges.geometry.dispose();
        (edges.material as THREE.Material).dispose();
      });
    });
  }

  private dimsText(): string {
    const b = new this.T.Box3().setFromObject(this.pivot!);
    const s = b.getSize(new this.T.Vector3());
    const f = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    const unit = this.ext() === 'glb' || this.ext() === 'gltf' ? ' m' : '';
    return `${f(s.x)} × ${f(s.z)} × ${f(s.y)}${unit}`;
  }

  /** Centers the model on the ground and frames the camera around it. */
  private place() {
    const T = this.T;
    const pivot = this.pivot;
    if (!pivot || !this.camera || !this.controls || !this.scene) return;
    pivot.rotation.set(this.zUp() ? -Math.PI / 2 : 0, 0, 0);
    pivot.position.set(0, 0, 0);
    pivot.updateMatrixWorld(true);

    const box = new T.Box3().setFromObject(pivot);
    const size = box.getSize(new T.Vector3());
    const center = box.getCenter(new T.Vector3());
    pivot.position.set(-center.x, -box.min.y, -center.z);
    pivot.updateMatrixWorld(true);

    const span = Math.max(size.x, size.y, size.z) || 1;
    const h = size.y;
    this.camera.near = span / 500;
    this.camera.far = span * 60;
    this.camera.position.set(span * 1.35, h / 2 + span * 0.75, span * 1.6);
    this.controls.target.set(0, h / 2, 0);
    this.camera.updateProjectionMatrix();
    this.controls.saveState();
    this.controls.reset();

    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
      this.gridHelper.geometry.dispose();
    }
    const gridSize = Math.max(span * 2.4, 1);
    const grid = new T.GridHelper(gridSize, 24, 0x9db0c2, 0xd5dee8);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.7;
    grid.visible = this.grid();
    this.scene.add(grid);
    this.gridHelper = grid;

    if (this.sun) {
      const d = span * 1.6;
      this.sun.position.set(span * 1.2, span * 2, span * 0.8);
      const c = this.sun.shadow.camera as THREE.OrthographicCamera;
      c.left = c.bottom = -d;
      c.right = c.top = d;
      c.near = 0.1;
      c.far = span * 8;
      c.updateProjectionMatrix();
    }
  }

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
    if (this.mixer && this.play()) this.mixer.update(this.clock!.getDelta());
    else this.clock?.getDelta();
    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
  }

  private dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.cleanup.forEach((f) => f());
    this.controls?.dispose();
    this.scene?.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
    });
    this.materials.forEach((mat) => {
      Object.values(mat).forEach((v) => (v as THREE.Texture | undefined)?.isTexture && (v as THREE.Texture).dispose());
      mat.dispose();
    });
    this.scene?.environment?.dispose();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }
}
