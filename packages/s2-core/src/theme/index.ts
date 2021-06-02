// 交叉表主题相关
import DefaultTheme from './default';
import { registerTheme } from './factory';

registerTheme('default', DefaultTheme); // 注册默认的主题

export { DefaultTheme };
export * from './factory';
