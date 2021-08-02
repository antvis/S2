import { DimensionType, DimensionItem } from './dimension';

export interface OperatedType {
  [type: string]: string[];
}

export const getDimensionsByPredicate = (
  data: DimensionType[],
  predicate: (value: DimensionItem) => boolean,
) => {
  return data.reduce((obj, t) => {
    obj[t.type] = t.items.filter(predicate).map((i) => i.id);
    return obj;
  }, {} as OperatedType);
};
