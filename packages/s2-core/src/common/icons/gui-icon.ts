/**
 * @Description: 请严格要求 svg 的 viewBox，若设计产出的 svg 不是此规格，请叫其修改为 '0 0 1024 1024'
 */
import { Group, type ImageStyleProps } from '@antv/g';
import { omit, clone } from 'lodash';
import { CustomImage } from '../../engine';
import { getIcon } from './factory';

const STYLE_PLACEHOLDER = '<svg';

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
    // TODO: 可能不需要透传 cfg 到 group
    super({ name: cfg.name, style: cfg });
    this.cfg = cfg;
    this.render();
  }

  // 获取 Image 实例，使用缓存，以避免滚动时因重复的 new Image() 耗时导致的闪烁问题
  /* 异步获取 image 实例 */
  private getImage(
    name: string,
    cacheKey: string,
    fill?: string,
  ): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject): void => {
      const img = new Image();
      // 成功
      img.onload = () => {
        ImageCache[cacheKey] = img;
        resolve(img);
      };
      // 失败
      img.onerror = (e) => {
        reject(e);
      };
      let svg = getIcon(name);

      // 兼容三种情况
      // 1、base 64
      // 2、svg本地文件（兼容老方式，可以改颜色）
      // 3、线上支持的图片地址
      if (
        svg &&
        (svg.includes('data:image/svg+xml') || this.hasSupportSuffix(svg))
      ) {
        // 传入 base64 字符串
        // 或者 online 链接
        img.src = svg;
      } else if (svg) {
        // 传入 svg 字符串（支持颜色fill）
        if (fill) {
          // 如果有fill，移除原来的 fill
          // 这里有一个潜在的问题，不同的svg里面的schema不尽相同，导致这个正则考虑不全
          // 1、fill='' 2、fill 3、fill-***(不需要处理)
          // eslint-disable-next-line no-useless-escape
          svg = svg.replace(/fill=[\'\"]#?\w+[\'\"]/g, ''); // 移除 fill="red|#fff"
          svg = svg.replace(/fill>/g, '>'); // fill> 替换为 >
        }
        svg = svg.replace(
          STYLE_PLACEHOLDER,
          `${STYLE_PLACEHOLDER} fill="${fill}"`,
        );
        // 兼容 Firefox: https://github.com/antvis/S2/issues/1571 https://stackoverflow.com/questions/30733607/svg-data-image-not-working-as-a-background-image-in-a-pseudo-element/30733736#30733736
        // https://www.chromestatus.com/features/5656049583390720
        img.src = `data:image/svg+xml;utf-8,${encodeURIComponent(svg)}`;
      }
    });
  }

  hasSupportSuffix = (image: string) => {
    return ['.png', '.jpg', '.gif', '.svg'].some((suffix) =>
      image?.endsWith(suffix),
    );
  };

  private render() {
    const { name, fill } = this.cfg;
    const attrs = clone(this.cfg);
    const image = new CustomImage(GuiIcon.type, {
      ...omit(attrs, 'fill'),
      type: GuiIcon.type,
    });

    const cacheKey = `${name}-${fill}`;
    const img = ImageCache[cacheKey];
    if (img) {
      // already in cache
      image.attr('img', img);
      this.appendChild(image);
    } else {
      this.getImage(name, cacheKey, fill)
        .then((value: HTMLImageElement) => {
          image.attr('img', value);
          this.appendChild(image);
        })
        .catch((err: Event) => {
          // eslint-disable-next-line no-console
          console.warn(`GuiIcon ${name} load error`, err);
        });
    }
    this.iconImageShape = image;
  }
}
