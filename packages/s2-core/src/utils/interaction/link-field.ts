import { isFunction } from 'lodash';
import type { ViewMeta } from '../../common/interface/basic';
import type { Node } from '../../facet/layout/node';

export const isLinkFieldNode = (
  linkFields: string[] | ((meta: Node | ViewMeta) => boolean),
  meta: Node | ViewMeta,
): boolean => {
  if (isFunction(linkFields)) {
    return linkFields(meta);
  }

  return linkFields.some(
    (field) =>
      field === meta.field || field === meta.id || field === meta.valueField,
  );
};
