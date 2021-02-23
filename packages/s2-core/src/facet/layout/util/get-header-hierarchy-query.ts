import * as _ from 'lodash';
import { Node } from '../node';

interface Query {
  [key: string]: string;
}

/**
 * 返回查询参数，当前是西湖区的节点，则返回 { province: '浙江省', city: '杭州市', area: '西湖区'}
 * @param node 叶子节点
 */
export default function getHeaderHierarchyQuery(node: Node): Query {
  if (_.isNil(node)) {
    return null;
  }
  const query = {};
  let nodeIn = node;
  while (nodeIn) {
    query[nodeIn.key] = nodeIn.value;
    nodeIn = nodeIn.parent;
  }
  return query;
}
