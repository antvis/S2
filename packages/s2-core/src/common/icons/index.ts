import { getIcon, registerIcon } from './factory';
import { GuiIcon } from './gui-icon';
import { HtmlIcon } from './html-icon';
import * as SvgMap from './svg';

// eslint-disable-next-line no-restricted-syntax
for (const key in SvgMap) {
  if (key !== '__esModule') {
    registerIcon(key, SvgMap[key]);
  }
}
registerIcon(
  'MinusSquare',
  'https://gw.alipayobjects.com/zos/bmw-prod/6385010c-e6b0-4790-b690-02a502433eb3.svg',
);
// data-cell.ts 默认导出这个目录中对应的 API
export { GuiIcon, HtmlIcon, registerIcon, getIcon };
