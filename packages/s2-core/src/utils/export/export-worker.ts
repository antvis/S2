export function getCsvString(v: any): string {
  if (!v) {
    return v;
  }
  if (typeof v === 'string') {
    const out = v;
    return `"${out.replace(/"/g, '""')}"`;
  }
  return `"${v}"`;
}
