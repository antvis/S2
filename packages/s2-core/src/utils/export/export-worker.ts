import { replaceEmptyFieldValue } from '../../facet/utils';

export function getCsvString(v: any): string {
  if (!v) {
    return v;
  }

  const value = replaceEmptyFieldValue(v);

  if (typeof value === 'string') {
    const out = value;
    // 需要替换", https://en.wikipedia.org/wiki/Comma-separated_values#Example
    return `"${out.replace(/"/g, '""')}"`;
  }

  return `"${value}"`;
}
