import { CustomTreeItem } from '@/common/interface';

export const transformCustomTreeItems = (itemConfig: any[]) => {
  if (itemConfig) {
    return itemConfig.map((config) => {
      return {
        key: config.key,
        title: config.title,
        children: transformCustomTreeItems(config.children),
        collapsed: config.collapsed,
        description: config.description,
      } as CustomTreeItem;
    });
  }
  return [];
};
