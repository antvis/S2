import { get, isEmpty } from 'lodash';
import { ID_SEPARATOR, ROOT_ID } from '../../../common/constant';
import { SpreadsheetFacetCfg } from '../../../common/interface';
/**
 * Row and column header node id generator.
 * Users can make specific rows or columns display or hidden according to the option configuration
 * @param parentId
 * @param value
 * @param cfg
 */

export const generateId = (
  parentId: string,
  value: string,
  cfg: SpreadsheetFacetCfg,
): string => {
  const id = `${parentId}${ID_SEPARATOR}${value}`;
  const customHeaders = get(cfg, 'spreadsheet.options.customHeaderCells');
  const mode = customHeaders?.mode;
  const cellLabels = customHeaders?.cellLabels;

  if (isEmpty(cellLabels)) return id;

  const customIds = cellLabels.map(
    (v: string) => `${ROOT_ID}${ID_SEPARATOR}${v}`,
  );

  let res: string;

  // omit(default): the all cells of customIds would be hidden.
  if (mode !== 'pick') {
    res = !customIds.includes(id) ? id : null;
  } else {
    // pick: only show the cells those included in customIds.
    for (const v of customIds) {
      const idLevel = id.split(ID_SEPARATOR).length;
      const customIdLevel = v.split(ID_SEPARATOR).length;
      // The same levels needed to be matched exactly.
      if (idLevel === customIdLevel) {
        if (id === v) {
          res = id;
          break;
        }
      } else {
        // Different levels, fuzzy matching
        const max = idLevel > customIdLevel ? id : v;
        const min = idLevel < customIdLevel ? id : v;
        if (max.includes(min)) {
          res = id;
          break;
        }
      }
    }
  }

  return res;
};
