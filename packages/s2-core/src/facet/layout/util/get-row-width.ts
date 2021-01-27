import { get } from '@antv/util';

export default function getRowWidth(node, rowCfg, cellCfg) {
  const key: string = node.key;
  return get(rowCfg, `widthByField.${key}`, rowCfg.width) || cellCfg.width;
}
