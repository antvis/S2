/**
 * 从 这样的结构中找到当前cell对应的value度量值
 * values: {
 *   fields: [],
 *   extra: [],
 *   data: []
 * }
 * 当点击某个cell的时候，通过rowQuery 去fields中匹配出 value field
 */
import _ from 'lodash';
export default function getRightFieldInQuery(
  rowQuery: Record<string, any>,
  rowFields: string[],
): string {
  let field = '';
  for (let k = rowFields.length - 1; k >= 0; k--) {
    if (_.has(rowQuery, rowFields[k])) {
      field = rowFields[k]; // 行头中的维度
      break;
    }
  }
  return field;
}
