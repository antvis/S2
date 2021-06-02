import { get } from 'lodash';

export default function getColWidth(node, colCfg, cellCfg) {
  const value = `${node.value}`;
  return get(colCfg, `widthByFieldValue.${value}`, cellCfg.width);
}
