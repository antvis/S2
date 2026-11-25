import { isNaN, toNumber } from 'lodash';
import { PRECISION } from '../common/constant';
import { getLang, type LangType } from '../common/i18n';

const FORMATTERS: { [K in LangType]: [string[], number[]] } = {
  en_US: ['KMBTP'.split(''), [1e3, 1e3, 1e3, 1e3, 1e3]],
  ru_RU: [
    ['тысяча', 'миллион', 'миллиард', 'триллион', 'квадриллион'],
    [1e3, 1e3, 1e3, 1e3, 1e3],
  ],
  zh_CN: [
    ['万', '亿'],
    [1e4, 1e4],
  ],
};

/**
 * 自动格式化
 * 规则
 *  1，小于1w，使用逗号分割，例如 3,459
 *  2，大于1w，使用语义化，例如 3.2万，3.4亿 2,234万
 * @param v
 * @param fixed
 * @param formatter
 */
export const auto = (
  v: number,
  fixed = 2,
  formatter = FORMATTERS[getLang()] || FORMATTERS.zh_CN,
): string => {
  if (typeof v !== 'number' || isNaN(v)) {
    return '';
  }

  // let n = Math.abs(v); // abs什么鬼。
  let n = v;
  // 语义化
  const [texts, powers] = formatter;
  // 已经用到的单位个数，0 表示没有单位
  let unit = 0;

  while (unit < texts.length && n >= powers[unit]) {
    n /= powers[unit];
    unit += 1;
  }

  /*
   * parseFloat 解决 toFixed 出现很多 0 结尾。
   * 举例：123.toFixed(2) = '123.00'，需要返回 '123'
   */
  n = parseFloat(n.toFixed(fixed));

  // 四舍五入后可能进位到下一个单位，例如 9999.999 => 10000 => 1万
  if (unit < texts.length && n >= powers[unit]) {
    n = parseFloat((n / powers[unit]).toFixed(fixed));
    unit += 1;
  }

  // 千分位
  const output = n >= 1000 ? n.toLocaleString('en') : `${n}`;

  // 加上最后的单位
  return unit === 0 ? output : `${output} ${texts[unit - 1]}`;
};

/*
 * 简单处理小数精度误差，保持和Spreadsheet统一逻辑
 * 技术细节：https://juejin.im/post/5ce373d651882532e409ea96
 */
export const parseNumberWithPrecision = (value: number | string) =>
  Number.parseFloat((toNumber(value) || 0).toPrecision(PRECISION));
