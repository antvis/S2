/**
 * @description: 请严格要求 svg 的 viewBox，若设计产出的 svg 不是此规格，请叫其修改为 '0 0 1024 1024'
 */
import { Group, type ImageStyleProps } from '@antv/g';
import { clone, omit } from 'lodash';
import { CustomImage } from '../../engine';
import { DebuggerUtil } from '../debug';
import { getIcon } from './factory';

const STYLE_PLACEHOLDER = '<svg';

const SVG_CONTENT_TYPE = 'data:image/svg+xml';

// Image 缓存
const ImageCache: Record<string, HTMLImageElement> = {};

export interface GuiIconCfg extends Omit<ImageStyleProps, 'fill'> {
  readonly name: string;
  readonly fill?: string;
}

/**
 * 使用 iconfont 上的 svg 来创建 Icon
 */
export class GuiIcon extends Group {
  static type = '__GUI_ICON__';

  // icon 对应的 GImage 对象
  public iconImageShape: CustomImage;

  private cfg: GuiIconCfg;

  constructor(cfg: GuiIconCfg) {
    super({ name: cfg.name });
    this.cfg = cfg;
    this.render();
  }

  public getCfg(): GuiIconCfg {
    return this.cfg;
  }

  // 获取 Image 实例，使用缓存，以避免滚动时因重复的 new Image() 耗时导致的闪烁问题
  /* 异步获取 image 实例 */
  public getImage(
    name: string,
    cacheKey: string,
    fill?: string,
  ): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject): void => {
      let svg = getIcon(name);

      if (!svg) {
        return;
      }

      const img = new Image();

      img.onload = () => {
        ImageCache[cacheKey] = img;
        resolve(img);
      };
      img.onerror = reject;

      /*
       * 兼容三种情况
       * 1、base 64
       * 2、svg本地文件（兼容老方式，可以改颜色）
       * 3、线上支持的图片地址
       */
      if (svg && (svg.includes(SVG_CONTENT_TYPE) || this.isOnlineLink(svg))) {
        /*
         * 传入 base64 字符串
         * 或者 online 链接
         */
        img.src = svg;
        // https://github.com/antvis/S2/issues/2513
        img.crossOrigin = 'anonymous';
      } else {
        // 传入 svg 字符串（支持颜色fill）
        if (fill) {
          /*
           * 如果有fill，移除原来的 fill
           * 这里有一个潜在的问题，不同的svg里面的schema不尽相同，导致这个正则考虑不全
           * 1、fill='' 2、fill 3、fill-***(不需要处理)
           */
          // 移除 fill="red|#fff"
          // eslint-disable-next-line no-useless-escape
          svg = svg.replace(/fill=[\'\"]#?\w+[\'\"]/g, '');
          // fill> 替换为 >
          svg = svg.replace(/fill>/g, '>');
        }

        svg = svg.replace(
          STYLE_PLACEHOLDER,
          `${STYLE_PLACEHOLDER} fill="${fill}"`,
        );

        /**
         * 兼容 Firefox: https://github.com/antvis/S2/issues/1571 https://stackoverflow.com/questions/30733607/svg-data-image-not-working-as-a-background-image-in-a-pseudo-element/30733736#30733736
         * https://www.chromestatus.com/features/5656049583390720
         */
        img.src = `${SVG_CONTENT_TYPE};utf-8,${encodeURIComponent(svg)}`;
      }
    });
  }

  /**
   * 1. https://xxx.svg
   * 2. http://xxx.svg
   * 3. //xxx.svg
   */
  public isOnlineLink = (src: string) => /^(?:https?:)?(?:\/\/)/.test(src);

  private render() {
    const { name, fill } = this.cfg;
    const attrs = clone(this.cfg);
    const image = new CustomImage(GuiIcon.type, {
      style: omit(attrs, 'fill'),
    });

    this.iconImageShape = image;
    this.setImageAttrs({ name, fill });
  }

  public setImageAttrs(attrs: Partial<{ name: string; fill: string }>) {
    let { name, fill } = attrs;
    const { iconImageShape: image } = this;

    // 保证 name 和 fill 都有值
    name = name || this.cfg.name;
    fill = fill || this.cfg.fill;

    const cacheKey = `${name}-${fill}`;
    const img = ImageCache[cacheKey];

    if (img) {
      // already in cache
      image.attr('img', img);
      this.appendChild(image);
    } else {
      this.getImage(name, cacheKey, fill)
        .then((value: HTMLImageElement) => {
          // 异步加载完成后，当前 Cell 可能已经销毁了
          if (this.destroyed) {
            DebuggerUtil.getInstance().logger(`GuiIcon ${name} destroyed.`);

            return;
          }

          image.attr('img', value);
          this.appendChild(image);
        })
        .catch((event: string | Event) => {
          // 如果是 TypeError, 则是 G 底层渲染有问题, 其他场景才报加载异常的错误
          if (event instanceof TypeError) {
            // eslint-disable-next-line no-console
            console.warn(`GuiIcon ${name} destroyed:`, event);

            return;
          }

          // eslint-disable-next-line no-console
          console.error(`GuiIcon ${name} load failed:`, event);
        });
    }
  }
}
