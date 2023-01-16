import { get, merge } from 'lodash';
import { ZH_CN as BASE_ZH_CN } from './zh_CN';
import { EN_US as BASE_EN_US } from './en_US';

const DEFAULT_LANG: LangType = 'zh_CN';

export type LangType = 'zh_CN' | 'en_US';

export type LocaleType = {
  [K in LangType]: Record<string, string>;
};

let lang: LangType = DEFAULT_LANG;

let locale: LocaleType = {
  zh_CN: BASE_ZH_CN,
  en_US: BASE_EN_US,
};

export const getLang = () => lang;

/**
 * 设置语言
 * @param lang
 */
export const setLang = (langType: LangType) => {
  lang = langType || DEFAULT_LANG;
};

/**
 * 拓展locale配置
 */
export const extendLocale = (extraLocale: LocaleType) => {
  locale = merge({}, locale, extraLocale);
};

export const getLocale = () => locale;

export const i18n = (key: string, defaultValue = key) =>
  get(locale, [lang, key], defaultValue);
