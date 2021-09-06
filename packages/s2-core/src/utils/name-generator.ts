import { ID_SEPARATOR, ROOT_ID } from '@/common/constant';

export const generateNodeName = (name: string) => {
  return `${ROOT_ID}${ID_SEPARATOR}${name}`;
};
