import type { Node } from '../../facet/layout/node';
import type { ViewMeta } from '../../common/interface/basic';

export const checkIsLinkField = (
  linkFields: string[] | ((meta: Node | ViewMeta) => boolean),
  meta: Node | ViewMeta,
): boolean =>
  typeof linkFields === 'function'
    ? linkFields(meta)
    : linkFields.some(
        (field) =>
          field === meta.field ||
          field === meta.id ||
          field === meta.valueField,
      );
