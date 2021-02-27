import { Lang } from '../common/i18n';
import { isNaN } from 'lodash';

const FORMATTERS = {
  en_US: ['KMBTP'.split(''), [1e3, 1e3, 1e3, 1e3, 1e3]],
  zh_CN: [
    ['万', '亿'],
    [10000, 1e4],
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
  formatter = FORMATTERS[Lang] || FORMATTERS.zh_CN,
): string => {
  if (typeof v !== 'number' || isNaN(v)) {
    return '';
  }
  // let n = Math.abs(v); // abs什么鬼。
  let n = v;
  // 语义化
  const [texts, powers] = formatter;

  let loop = 0;
  let power;

  while (true) {
    power = powers[loop] as number;

    if (n >= power && loop < texts.length) {
      n /= power;
    } else {
      break;
    }
    ++loop;
  }

  // parseFloat 解决 toFixed 出现很多 0 结尾。
  // 举例：123.toFixed(2) = '123.00'，需要返回 '123'
  n = parseFloat(n.toFixed(fixed));

  // 千分位
  const output = n >= 1000 ? n.toLocaleString('en') : `${n}`;

  // 加上最后的单位
  return loop === 0 ? output : `${output} ${texts[loop - 1]}`;
};
