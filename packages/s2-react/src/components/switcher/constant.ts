export const SWITCHER_PREFIX_CLS = 'switcher';

export enum FieldType {
  Rows = 'rows',
  Cols = 'columns',
  Values = 'values',
}

export enum DroppableType {
  Dimensions = 'dimensions',
  Measures = 'measures',
  Rows = 'rows',
  Cols = 'cols',
}

export const SWITCHER_FIELDS = [
  FieldType.Rows,
  FieldType.Cols,
  FieldType.Values,
];
