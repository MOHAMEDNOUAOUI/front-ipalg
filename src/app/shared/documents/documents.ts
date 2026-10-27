import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { Row, fmtDate } from '../../modules/module.types';
import { StoredDoc, docStore } from './doc-store';
import { House3d } from './house-3d';
import { MODEL_EXT, ModelViewer, extOf } from './model-viewer';
import { PlanDrawing, PlanKind } from './plan-drawing';

export interface Doc {
  id: string;
  name: string;
  type: string;
  /** Drawn plan, or a scanned page when absent. */
  plan?: PlanKind;
  size: string;
  date: string;
  /** Real file from the backend; shown instead of the drawn demo when present. */
  url?: string;
  mime?: string;
  /** Uploaded by the user, so it can be removed. */
  own?: boolean;
  /** 3D file opened with the model viewer. */
  model?: boolean;
  ext?: string;
  /** Files a .gltf points to, as object URLs by file name. */
  resources?: Record<string, string>;
}

const RESOURCE_EXT = ['bin', 'png', 'jpg', 'jpeg', 'webp', 'ktx2', 'mtl', 'tga', 'bmp', 'gif', 'dds'];
const JUNK = /^(\.|thumbs\.db$|desktop\.ini$)/i;

/** Reads every file under a dropped folder. */
async function walk(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) return [await new Promise<File>((ok, ko) => (entry as FileSystemFileEntry).file(ok, ko))];
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const out: File[] = [];
  for (;;) {
    const batch = await new Promise<FileSystemEntry[]>((ok, ko) => reader.readEntries(ok, ko));
    if (!batch.length) break;
    for (const e of batch) out.push(...(await walk(e)));
  }
  return out;
}

function sizeText(n: number): string {
  return n >= 1048576 ? `${(n / 1048576).toFixed(1).replace('.', ',')} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`;
}

function hash(s: string): number {
  let h = 5;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** The fields the plans need, read from whichever columns a module has. */
function subjectOf(r: Row): Row {
  const text = String(r['designation'] ?? r['bien'] ?? r['objet'] ?? '');
  const h = hash(String(r.id));
  const nature =
    typeof r['nature'] === 'string'
      ? r['nature']
      : /terrain|parcelle|lot /i.test(text)
        ? 'Terrain'
        : /villa/i.test(text)
          ? 'Logement de fonction'
          : /immeuble/i.test(text)
            ? 'Immeuble de rapport'
            : /entrepôt/i.test(text)
              ? 'Entrepôt'
              : /siège/i.test(text)
                ? 'Siège'
                : 'Agence';
  return {
    id: r.id,
    designation: text,
    titre: String(r['titre'] ?? r['contrat'] ?? r['ref'] ?? ''),
    nature,
    surface: Number(r['surface']) || (nature === 'Terrain' ? 2500 + (h % 6000) : 250 + (h % 1800)),
    ville: String(r['ville'] ?? r['conservation'] ?? ''),
    acquis: String(r['acquis'] ?? r['signature'] ?? r['depot'] ?? r['date'] ?? ''),
  };
}

/** Documents attached to a property, with plans opened in a zoomable viewer. */
@Component({
  selector: 'app-documents',
  imports: [NgIcon, PlanDrawing, House3d, ModelViewer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents {
  readonly row = input.required<Row>();
  /** Documents sent by the backend; the demo set is built from the row until then. */
  readonly files = input<Doc[] | null>(null);

  private readonly doc = inject(DOCUMENT);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');

  protected readonly current = signal<number | null>(null);
  protected readonly zoom = signal(1);
  protected readonly pan = signal({ x: 0, y: 0 });
  private drag: { x: number; y: number; px: number; py: number } | null = null;
  private opener: HTMLElement | null = null;

  protected readonly subject = computed(() => subjectOf(this.row()));

  protected readonly accept = ['.pdf', 'image/*', ...MODEL_EXT.map((e) => '.' + e), ...RESOURCE_EXT.map((e) => '.' + e)].join(',');
  protected readonly uploaded = signal<Doc[]>([]);
  protected readonly over = signal(false);
  protected readonly notice = signal('');
  private stored: StoredDoc[] = [];
  private urls: string[] = [];
  private readonly sanitizer = inject(DomSanitizer);

  /** Storage key: the same designation can repeat across modules, the id cannot repeat within one. */
  private readonly storeKey = computed(() => `${this.subject()['designation']}|${this.row().id}`);

  protected frameUrl(d: Doc) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(d.url!);
  }

  protected is3d(d: Doc): boolean {
    return d.plan === '3d' || !!d.model;
  }

  protected readonly docs = computed<Doc[]>(() => {
    const given = this.files();
    if (given) return given;
    return [...this.uploaded(), ...this.demo()];
  });

  private readonly demo = computed<Doc[]>(() => {
    const r = this.subject();
    const survey = 'bornage' in this.row();
    const h = hash(String(r.id));
    const date = fmtDate(String(r['acquis'] ?? ''));
    const mo = (n: number) => `${(((h >> n) % 40) + 8) / 10}`.replace('.', ',') + ' Mo';
    const land = r['nature'] === 'Terrain';
    const list: Doc[] = [
      { id: 'titre', name: survey ? `Dossier ${r['titre']}` : `Titre foncier ${r['titre'] ?? ''}`.trim(), type: 'Titre', size: mo(1), date },
      { id: 'masse', name: survey ? 'Plan de bornage' : 'Plan de masse', type: 'Plan', plan: 'masse', size: mo(2), date },
    ];
    if (!land) {
      list.push(
        { id: 'etage', name: 'Plan du rez-de-chaussée', type: 'Plan', plan: 'etage', size: mo(3), date },
        { id: 'facade', name: 'Plan de façade', type: 'Plan', plan: 'facade', size: mo(4), date }
      );
    }
    list.push({ id: 'maquette', name: 'Maquette 3D', type: '3D', plan: '3d', size: mo(6), date });
    if (!survey) list.push({ id: 'acte', name: 'Acte d’acquisition', type: 'Acte', size: mo(5), date });
    return list;
  });

  protected readonly active = computed(() => {
    const i = this.current();
    return i === null ? null : (this.docs()[i] ?? null);
  });

  constructor() {
    effect(() => {
      if (this.current() !== null) queueMicrotask(() => this.dialog()?.nativeElement.focus());
    });
    effect(() => {
      const k = this.storeKey();
      void docStore.list(k).then((list) => {
        if (k === this.storeKey()) this.show(list);
      });
    });
    inject(DestroyRef).onDestroy(() => this.urls.forEach((u) => URL.revokeObjectURL(u)));
  }

  /** Turns stored files into documents with fresh object URLs. */
  private show(list: StoredDoc[]) {
    this.urls.forEach((u) => URL.revokeObjectURL(u));
    this.urls = [];
    this.stored = list;
    const make = (b: Blob) => {
      const u = URL.createObjectURL(b);
      this.urls.push(u);
      return u;
    };
    this.uploaded.set(
      list.map((s) => {
        const model = MODEL_EXT.includes(s.ext);
        return {
          id: s.id,
          name: s.name,
          type: model ? '3D' : s.ext === 'pdf' ? 'PDF' : 'Image',
          size: sizeText(s.size),
          date: s.date,
          url: make(s.blob),
          mime: s.mime,
          ext: s.ext,
          model,
          own: true,
          resources: s.extra ? Object.fromEntries(s.extra.map((x) => [x.name, make(x.blob)])) : undefined,
        };
      })
    );
  }

  protected pick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    void this.add(Array.from(input.files ?? []));
    input.value = '';
  }

  protected drop(ev: DragEvent) {
    ev.preventDefault();
    this.over.set(false);
    const items = Array.from(ev.dataTransfer?.items ?? []);
    const entries = items.map((i) => i.webkitGetAsEntry?.()).filter((e): e is FileSystemEntry => !!e);
    // entries must be taken inside the event; folders are then read asynchronously
    if (entries.some((e) => e.isDirectory)) {
      void Promise.all(entries.map(walk)).then((all) => this.add(all.flat()));
    } else {
      void this.add(Array.from(ev.dataTransfer?.files ?? []));
    }
  }

  protected dragging(ev: DragEvent, on: boolean) {
    ev.preventDefault();
    this.over.set(on);
  }

  /** Adds the chosen files or folder; when a model is present, its textures and data files travel with it. */
  private async add(chosen: File[]) {
    const files = chosen.filter((f) => !JUNK.test(f.name));
    if (!files.length) return;
    const needs = (f: File) => MODEL_EXT.includes(extOf(f.name)) && extOf(f.name) !== 'glb'; // a .glb carries its own textures
    const hasModel = files.some((f) => MODEL_EXT.includes(extOf(f.name)));
    const extra = hasModel ? files.filter((f) => RESOURCE_EXT.includes(extOf(f.name)) || f.type.startsWith('image/')) : [];
    const main = files.filter((f) => !extra.includes(f));
    const known = (f: File) => extOf(f.name) === 'pdf' || f.type.startsWith('image/') || MODEL_EXT.includes(extOf(f.name));
    const ok = main.filter(known);
    const date = fmtDate(new Date().toISOString().slice(0, 10));
    const added: StoredDoc[] = ok.map((f) => ({
      id: `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      mime: f.type,
      ext: extOf(f.name),
      size: f.size + (needs(f) ? extra.reduce((n, x) => n + x.size, 0) : 0),
      date,
      blob: f,
      extra: needs(f) && extra.length ? extra.map((x) => ({ name: x.name, blob: x })) : undefined,
    }));
    const skipped = main.length - ok.length;
    this.notice.set(
      skipped ? `${skipped} fichier${skipped > 1 ? 's' : ''} ignoré${skipped > 1 ? 's' : ''} : format non pris en charge.` : ''
    );
    if (!added.length) return;
    const next = [...added, ...this.stored];
    try {
      await docStore.save(this.storeKey(), next);
    } catch {
      this.notice.set('Le fichier est ouvert mais n’a pas pu être conservé dans ce navigateur (espace insuffisant).');
    }
    this.show(next);
    const i = 0;
    this.open(i, null);
  }

  protected async remove(id: string, ev: Event) {
    ev.stopPropagation();
    const next = this.stored.filter((s) => s.id !== id);
    await docStore.save(this.storeKey(), next).catch(() => undefined);
    this.show(next);
    if (this.current() !== null) this.close();
  }

  protected open(i: number, ev: Event | null) {
    this.opener = (ev?.currentTarget as HTMLElement) ?? null;
    this.current.set(i);
    this.fit();
  }

  protected close() {
    this.current.set(null);
    this.opener?.focus();
  }

  protected go(step: number) {
    const n = this.docs().length;
    this.current.update((i) => (i === null ? i : (i + step + n) % n));
    this.fit();
  }

  protected zoomBy(f: number) {
    this.zoom.update((z) => Math.min(5, Math.max(0.4, +(z * f).toFixed(3))));
  }

  protected fit() {
    this.zoom.set(1);
    this.pan.set({ x: 0, y: 0 });
  }

  protected onWheel(e: WheelEvent) {
    const d = this.active();
    if (!d || this.is3d(d) || d.mime === 'application/pdf' || d.ext === 'pdf') return;
    e.preventDefault();
    this.zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }

  protected down(e: PointerEvent) {
    const d = this.active();
    if (!d || this.is3d(d) || d.ext === 'pdf') return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.drag = { x: e.clientX, y: e.clientY, px: this.pan().x, py: this.pan().y };
  }

  protected move(e: PointerEvent) {
    if (!this.drag) return;
    this.pan.set({ x: this.drag.px + e.clientX - this.drag.x, y: this.drag.py + e.clientY - this.drag.y });
  }

  protected up() {
    this.drag = null;
  }

  protected key(e: KeyboardEvent) {
    const k = e.key;
    if (k === 'Escape') {
      e.stopPropagation();
      this.close();
    } else if (k === '+' || k === '=') this.zoomBy(1.2);
    else if (k === '-') this.zoomBy(1 / 1.2);
    else if (k === '0') this.fit();
    else if (k === 'ArrowRight') this.go(1);
    else if (k === 'ArrowLeft') this.go(-1);
  }

  /** Saves the drawn plan as an SVG file. */
  protected download() {
    const d = this.active();
    if (d?.url) {
      const a = this.doc.createElement('a');
      a.href = d.url;
      a.download = d.name;
      a.click();
      return;
    }
    const svg = this.stage()?.nativeElement.querySelector('svg');
    if (!svg || !d) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const a = this.doc.createElement('a');
    a.href = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml' }));
    a.download = `${d.name}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
