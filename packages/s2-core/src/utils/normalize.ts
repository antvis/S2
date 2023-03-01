import type { TextAlign, TextBaseline } from '../common/interface';

export enum NormalizedAlign {
  Start,
  Center,
  End,
}

export const normalizeTextAlign = (align: TextAlign | TextBaseline) => {
  if (['left', 'top'].includes(align)) {
    return NormalizedAlign.Start;
  }

  if (['center', 'middle'].includes(align)) {
    return NormalizedAlign.Center;
  }

  return NormalizedAlign.End;
};
