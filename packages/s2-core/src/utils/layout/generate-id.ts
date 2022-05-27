import { ID_SEPARATOR } from '@/common/constant';
/**
 * Row and column header node id generator.
 * @param parentId
 * @param value
 */

export const generateId = (parentId: string, value: string): string => {
  return `${parentId}${ID_SEPARATOR}${value}`;
};
