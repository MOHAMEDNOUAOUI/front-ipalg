const int = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const dec1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const fmtInt = (n: number) => int.format(n);
export const fmtDec = (n: number) => dec1.format(n);
export const fmtPct = (part: number, total: number) =>
  total > 0 ? `${int.format(Math.round((part / total) * 100))} %` : '0 %';
