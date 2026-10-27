/**
 * Declarative description of a list module (table + KPIs + detail drawer).
 * `shared/data-page` renders any ModuleDef, so a new module is data, not a new component.
 */
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type ColType = 'text' | 'code' | 'money' | 'date' | 'status' | 'percent' | 'number' | 'long';
export type Row = Record<string, string | number> & { id: string };

export interface Col {
  key: string;
  label: string;
  type?: ColType;
  /** Shown in the detail drawer only, not as a table column. */
  drawerOnly?: boolean;
  /** Fixed choices for the form (a status column takes them from `statuses`). */
  options?: string[];
  required?: boolean;
}

export interface Kpi {
  label: string;
  value: (rows: Row[]) => string;
  detail?: (rows: Row[]) => string;
  /** Optional series drawn as a small line beside the figure; leave out when there is no real history. */
  trend?: number[];
  /** Whether the figure rising is good news; colours the line and the detail. Default: neutral. */
  better?: 'up' | 'down';
}

export interface ModuleDef {
  /** Route path, also the registry key. */
  key: string;
  title: string;
  subtitle: string;
  /** Label of the create button, e.g. "Nouvelle proposition". Omit for read-only modules. */
  newLabel?: string;
  /** Column that names a row in the drawer header. */
  titleKey: string;
  /** Column used by the status filter chips and its tones. */
  statusKey?: string;
  statuses?: Record<string, Tone>;
  /** Ordered happy path of the status column, drawn as a progress timeline in the detail drawer. */
  stages?: string[];
  /** Show the documents and plans of each row in the detail drawer. */
  documents?: boolean;
  cols: Col[];
  rows: Row[];
  kpis: Kpi[];
}

const int = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const dec = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtMoney = (n: number) => `${int.format(n)} MAD`;
export const fmtDate = (iso: string) => (iso ? dateFmt.format(new Date(iso)) : '—');
export const fmtMillions = (n: number) => `${dec.format(n / 1_000_000)} M MAD`;
export const fmtCount = (n: number) => int.format(n);

/** Builds rows from tuples, in the same order as `cols`, so data files stay compact. */
export function table(cols: Col[], tuples: (string | number)[][]): Row[] {
  return tuples.map((t, i) => {
    const row: Row = { id: String(i + 1) };
    cols.forEach((c, j) => (row[c.key] = t[j] ?? ''));
    return row;
  });
}

export const count = (rows: Row[], key: string, ...values: string[]) =>
  rows.filter((r) => values.includes(String(r[key]))).length;
export const sum = (rows: Row[], key: string, where?: (r: Row) => boolean) =>
  rows.filter((r) => !where || where(r)).reduce((a, r) => a + Number(r[key] || 0), 0);

/** Days from the fixed demo date (2026-10-26) so counts stay stable between runs. */
export const DEMO_TODAY = new Date('2026-10-26');
export const daysUntil = (iso: string) =>
  Math.round((new Date(iso).getTime() - DEMO_TODAY.getTime()) / 86_400_000);
