export function getCsvString(v: any): string {
  if (!v) return v;
  if (typeof v === 'string') {
    const out = v;
    // 需要替换", https://en.wikipedia.org/wiki/Comma-separated_values#Example
    return `"${out.replace(/"/g, '""')}"`;
  }
  return `"${v}"`;
}
