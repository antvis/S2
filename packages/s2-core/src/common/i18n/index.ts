import { get } from 'lodash';
import { ZH_CN } from './zh_CN';
import { EN_US } from './en_US';

export let Lang = 'zh_CN';

let Locale = ZH_CN;

const isEnUS = (l: string) => l.indexOf('en') === 0;

/**
 * 设置语言
 * @param lang
 */
export const setEVALocale = (lang: string) => {
  Lang = isEnUS(lang) ? 'en_US' : 'zh_CN';
  Locale = isEnUS(lang) ? EN_US : ZH_CN;
};

/**
 * 国际化方法
 * 国际化是 eva 整个整体设置，不跟着实例走！默认认为同一页面，不可能出现中文和英文两种语言
 *
 */
export const i18n = (key: string, defaultValue = key) => {
  return get(Locale, key, defaultValue);
};
