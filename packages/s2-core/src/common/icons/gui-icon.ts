/**
 * @Description: 请严格要求 svg 的 viewBox，若设计产出的 svg 不是此规格，请叫其修改为 '0 0 1024 1024'
 */
import { Group, Shape, type ShapeAttrs } from '@antv/g-canvas';
import { omit, clone } from 'lodash';
import { getIcon } from './factory';

const STYLE_PLACEHOLDER = '<svg';

const SVG_CONTENT_TYPE = 'data:image/svg+xml';

// Image 缓存
const ImageCache: Record<string, HTMLImageElement> = {};

export interface GuiIconCfg extends ShapeAttrs {
  readonly name: string;
}

/**
 * 使用 iconfont 上的 svg 来创建 Icon
 */
export class GuiIcon extends Group {
  static type = '__GUI_ICON__';

  // icon 对应的 GImage 对象
  public iconImageShape: Shape.Image;

  constructor(cfg: GuiIconCfg) {
    super(cfg);
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

      // 兼容三种情况
      // 1、base 64
      // 2、svg本地文件（兼容老方式，可以改颜色）
      // 3、线上支持的图片地址
      if (svg.includes(SVG_CONTENT_TYPE) || this.isOnlineLink(svg)) {
        img.src = svg;
      } else {
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
        img.src = `${SVG_CONTENT_TYPE};utf-8,${encodeURIComponent(svg)}`;
      }
    });
  }

  /**
   * 1. https://xxx.svg
   * 2. http://xxx.svg
   * 3. //xxx.svg
   */
  public isOnlineLink = (src: string) => {
    return /^(https?:)?(\/\/)/.test(src);
  };

  private render() {
    const { name, fill } = this.cfg;
    const attrs = clone(this.cfg);
    const imageShapeAttrs: ShapeAttrs = {
      ...omit(attrs, 'fill'),
      type: GuiIcon.type,
    };
    const image = new Shape.Image({
      attrs: imageShapeAttrs,
    });

    const cacheKey = `${name}-${fill}`;
    const img = ImageCache[cacheKey];
    if (img) {
      // already in cache
      image.attr('img', img);
      this.addShape('image', image);
    } else {
      this.getImage(name, cacheKey, fill)
        .then((value: HTMLImageElement) => {
          // 加载完成后，当前 Cell 可能已经销毁了
          if (this.destroyed) {
            return;
          }
          image.attr('img', value);
          this.addShape('image', image);
        })
        .catch((event: Event) => {
          // eslint-disable-next-line no-console
          console.error(`GuiIcon ${name} load failed`, event);
        });
    }
    this.iconImageShape = image;
  }
}
