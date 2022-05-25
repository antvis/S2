import { get, merge } from 'lodash';
import { ZH_CN as BASE_ZH_CN } from './zh_CN';
import { EN_US as BASE_EN_US } from './en_US';

export type LangType = 'zh_CN' | 'en_US';

export type LocaleType = {
  [K in LangType]: Record<string, string>;
};

let lang: LangType = 'zh_CN';

let locale: LocaleType = {
  zh_CN: BASE_ZH_CN,
  en_US: BASE_EN_US,
};

export const getLang = () => lang;

const isEnUS = (l: LangType) => l.indexOf('en') === 0;

/**
 * 设置语言
 * @param lang
 */
export const setLang = (l: LangType) => {
  lang = isEnUS(l) ? 'en_US' : 'zh_CN';
};

/**
 * 拓展locale配置
 */
export const extendLocale = (extend: LocaleType) => {
  locale = merge({}, locale, extend);
};

/**
 * 国际化方法
 * 国际化是 eva 整个整体设置，不跟着实例走！默认认为同一页面，不可能出现中文和英文两种语言
 *
 */
export const i18n = (key: string, defaultValue = key) => {
  return get(locale, [lang, key], defaultValue);
};
