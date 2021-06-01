export function getCsvString(v: any): string {
  if (!v) return v;
  if (typeof v === 'string') {
    // 1. replace '"': https://en.wikipedia.org/wiki/Comma-separated_values#Example
    return `" ${v.replace(/"/g, '""')}"`;
  }
  return `" ${v}"`;
}
