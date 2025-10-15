import { get, has } from 'lodash';

export function getByPath<T = any>(
  record: Record<string, any>,
  field: string,
): T {
  if (!record || !field) {
    return undefined as any;
  }

  // fast path for flat keys
  if (field.indexOf('.') === -1 && field.indexOf('[') === -1) {
    return record[field] as any;
  }

  return get(record, field) as any;
}

export function hasByPath(record: Record<string, any>, field: string): boolean {
  if (!record || !field) {
    return false;
  }

  if (field.indexOf('.') === -1 && field.indexOf('[') === -1) {
    return Object.prototype.hasOwnProperty.call(record, field);
  }

  return has(record, field);
}
