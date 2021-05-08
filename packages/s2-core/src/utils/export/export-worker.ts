export function getCsvString(v: any): string {
  if (!v) return v;
  if (typeof v === 'string') {
    // 1. replace '"': https://en.wikipedia.org/wiki/Comma-separated_values#Example
    // 2. add ' ': https://support.microsoft.com/en-us/office/stop-automatically-changing-numbers-to-dates-452bd2db-cc96-47d1-81e4-72cec11c4ed8
    return `" ${v.replace(/"/g, '""')}"`;
  }
  return `" ${v}"`;
}
