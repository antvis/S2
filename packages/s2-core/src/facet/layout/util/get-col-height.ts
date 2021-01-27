import { get } from '@antv/util';

export default function getColHeight(node, colCfg, cellCfg) {
  const key: string = node.key;
  return get(colCfg, `heightByField.${key}`, colCfg.height) || cellCfg.height;
}
