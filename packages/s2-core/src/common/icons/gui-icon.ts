/**
 * @Description: 请严格要求 svg 的 viewBox，若设计产出的 svg 不是此规格，请叫其修改为 '0 0 1024 1024'
 */
import { Group, Shape } from '@antv/g-canvas';
import { getIcon } from './factory';

const STYLE_PLACEHOLDER = '<svg';
// Image 缓存
const ImageCache: Record<string, HTMLImageElement> = {};

export interface GuiIconCfg {
  readonly type: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly fill?: string;
}

/**
 * 使用 iconfont 上的 svg 来创建 Icon
 */
export class GuiIcon extends Group {
  // icon 对应的 GImage 对象
  private image: Shape.Image;

  constructor(cfg: GuiIconCfg) {
    super(cfg);
    this.render();
  }

  // 获取 Image 实例，使用缓存，以避免滚动时因重复的 new Image() 耗时导致的闪烁问题
  /* 异步获取 image 实例 */
  private getImage(
    type: string,
    cacheKey: string,
    fill?: string,
  ): Promise<HTMLImageElement> {
    return new Promise((resolve: (i) => void, reject: (i) => void): void => {
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
      let svg = getIcon(type);

      // 兼容三种情况
      // 1、base 64
      // 2、svg本地文件（兼容老方式，可以改颜色）
      // 3、线上支持的图片地址
      if (svg && svg.includes('data:image/svg+xml')) {
        // 传入 base64 字符串
        img.src = svg;
      } else if (this.hasSupportSuffix(svg)) {
        // online 图片
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
        // https://www.chromestatus.com/features/5656049583390720
        // # 井号不能当做svg的body，这个bug在chrome72已经修复.
        svg = svg
          .replace(STYLE_PLACEHOLDER, `${STYLE_PLACEHOLDER} fill="${fill}"`)
          .replace(/#/g, '%23');
        img.src = `data:image/svg+xml;utf-8,${svg}`;
      }
    });
  }

  hasSupportSuffix = (image: string) => {
    return (
      image?.endsWith('.png') ||
      image?.endsWith('.jpg') ||
      image?.endsWith('.gif') ||
      image?.endsWith('.svg')
    );
  };

  /**
   * 渲染
   */
  private render(): void {
    const {
      x,
      y,
      width,
      height,
      type,
      fill,
      textAlign,
      textBaseline,
    } = this.cfg;
    const image = new Shape.Image({
      attrs: {
        x,
        y,
        width,
        height,
        textAlign,
        textBaseline,
      },
    });

    const cacheKey = `${type}-${fill}`;
    const img = ImageCache[cacheKey];
    if (img) {
      // already in cache
      image.attr('img', img);
      this.addShape('image', image);
    } else {
      this.getImage(type, cacheKey, fill)
        .then((value: HTMLImageElement) => {
          // 成功，设置到 GImage 中
          image.attr('img', value);
          this.addShape('image', image);
        })
        .catch((err: Event) => {
          // eslint-disable-next-line no-console
          console.warn(`GuiIcon ${type} load error`, err);
        });
    }
    this.image = image;
  }
}
