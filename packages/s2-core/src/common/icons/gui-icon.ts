/**
 * @description: 请严格要求 svg 的 viewBox，若设计产出的 svg 不是此规格，请叫其修改为 '0 0 1024 1024'
 */
import { Group, Path, PointLike, Rect, type ImageStyleProps } from '@antv/g';
import { clone, omit } from 'lodash';
import { CustomImage } from '../../engine';
import { batchSetStyle } from '../../utils/g-utils';
import { DebuggerUtil } from '../debug';
import { getIcon } from './factory';

const STYLE_PLACEHOLDER = '<svg';

const SVG_CONTENT_TYPE = 'data:image/svg+xml';

// Image 缓存
const ImageCache: Record<string, HTMLImageElement> = {};

// 解析后的 Path 数据缓存
interface ParsedSvgData {
  viewBox: { width: number; height: number };
  paths: string[];
}
const PathDataCache: Record<string, ParsedSvgData> = {};

export interface GuiIconCfg extends Omit<ImageStyleProps, 'fill'> {
  readonly name: string;
  readonly fill?: string | null;
  /**
   * 图标渲染策略
   * @see S2BasicOptions.csp
   */
  readonly iconStrategy?: 'blob' | 'path';
}

/**
 * 从 SVG 字符串中解析 viewBox 和 path 数据
 * @see https://github.com/antvis/S2/issues/3125
 */
function parseSvgPaths(svg: string): ParsedSvgData | null {
  // 如果 SVG 包含 transform, g, rect 等不支持的复杂标签或属性，暂不使用 Path 模式
  // 避免渲染错位
  if (
    /transform|translate|scale|rotate|<g|<rect|<circle|<ellipse|<line|<polyline|<polygon|<text|<tspan/i.test(
      svg,
    )
  ) {
    return null;
  }

  // 提取 viewBox
  const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/);

  if (!viewBoxMatch) {
    return null;
  }

  const viewBoxParts = viewBoxMatch[1].split(/\s+/).map(Number);

  if (viewBoxParts.length < 4) {
    return null;
  }

  const viewBox = {
    width: viewBoxParts[2],
    height: viewBoxParts[3],
  };

  // 提取所有 path 的 d 属性
  // 使用 \b 确保匹配 d= 而不是 p-id= 等其他属性
  // 先将换行符替换为空格，使正则匹配更简单
  const normalizedSvg = svg.replace(/[\r\n]+/g, ' ');
  let paths: string[] = [];

  // 匹配双引号形式 d="..."
  const doubleQuoteMatches = normalizedSvg.match(/\bd="[^"]+"/g);

  if (doubleQuoteMatches) {
    paths = doubleQuoteMatches.map((m) => m.slice(3, -1));
  }

  // 如果双引号没有匹配到，尝试单引号形式 d='...'
  if (paths.length === 0) {
    const singleQuoteMatches = normalizedSvg.match(/\bd='[^']+'/g);

    if (singleQuoteMatches) {
      paths = singleQuoteMatches.map((m) => m.slice(3, -1));
    }
  }

  if (paths.length === 0) {
    return null;
  }

  return { viewBox, paths };
}

/**
 * 使用 iconfont 上的 svg 来创建 Icon
 * 支持两种渲染模式:
 * 1. Path 模式 (CSP 友好): 直接使用 G.Path 绘制矢量图形
 * 2. Image 模式 (兼容): 使用 Blob URL 加载 SVG 图片
 */
export class GuiIcon extends Group {
  static type = '__GUI_ICON__';

  // icon 对应的 GImage 对象 (Image 模式)
  public iconImageShape?: CustomImage;

  // icon 对应的 Path 和 HitArea 对象数组 (Path 模式)
  // 第一个元素是透明的点击热区 Rect，其余是实际的 Path
  public iconPathShapes: (Path | Rect)[] = [];

  private cfg: GuiIconCfg;

  // 是否使用 Path 模式渲染
  private usePathMode: boolean = false;

  constructor(cfg: GuiIconCfg) {
    super({ name: cfg.name });
    this.cfg = cfg;
    this.render();
  }

  public getCfg(): GuiIconCfg {
    return this.cfg;
  }

  /**
   * 尝试使用 Path 模式渲染图标 (CSP 完全兼容)
   * @returns 是否成功使用 Path 模式
   */
  private tryRenderAsPath(name: string, fill?: string | null): boolean {
    const svg = getIcon(name);

    if (!svg) {
      return false;
    }

    // 如果是在线链接或 base64，无法使用 Path 模式
    if (svg.includes(SVG_CONTENT_TYPE) || this.isOnlineLink(svg)) {
      return false;
    }

    const cacheKey = name;
    let parsedData = PathDataCache[cacheKey];

    if (!parsedData) {
      const parsed = parseSvgPaths(svg);

      if (parsed) {
        parsedData = parsed;
        PathDataCache[cacheKey] = parsed;
      }
    }

    if (!parsedData) {
      return false;
    }

    const { x = 0, y = 0, width, height, cursor } = this.cfg;

    // 计算缩放比例 (添加类型守卫以防 width/height 不是数字)
    const numWidth = typeof width === 'number' ? width : 0;
    const numHeight = typeof height === 'number' ? height : 0;
    const scaleX = numWidth / parsedData.viewBox.width;
    const scaleY = numHeight / parsedData.viewBox.height;

    // 清除旧的 path shapes
    this.iconPathShapes.forEach((shape) => {
      this.removeChild(shape);
      shape.destroy();
    });
    this.iconPathShapes = [];

    // 创建透明的矩形作为点击热区，确保整个图标区域都可以点击
    // 同时设置 cursor 样式
    const hitAreaRect = new Rect({
      style: {
        x: typeof x === 'number' ? x : 0,
        y: typeof y === 'number' ? y : 0,
        width: numWidth,
        height: numHeight,
        fill: 'transparent',
        cursor: cursor || 'default',
      },
    });

    this.appendChild(hitAreaRect);
    this.iconPathShapes.push(hitAreaRect);

    // 创建所有 path
    for (const pathData of parsedData.paths) {
      const pathShape = new Path({
        style: {
          d: pathData,
          fill: fill || '#000',
          transformOrigin: '0 0',
          transform: `translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`,
          cursor: cursor || 'default',
          // 禁用 path 的事件，让事件传递到底层的 hitAreaRect
          pointerEvents: 'none',
        },
      });

      this.appendChild(pathShape);
      this.iconPathShapes.push(pathShape);
    }

    return true;
  }

  // 获取 Image 实例，使用缓存，以避免滚动时因重复的 new Image() 耗时导致的闪烁问题
  /* 异步获取 image 实例 */
  public getImage(
    name: string,
    cacheKey: string,
    fill?: string | null,
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
          svg = svg.replace(/fill=[\'\"]\#?\w+[\'\"]/g, '');
          // fill> 替换为 >
          svg = svg.replace(/fill>/g, '>');
        }

        svg = svg.replace(
          STYLE_PLACEHOLDER,
          `${STYLE_PLACEHOLDER} fill="${fill}"`,
        );

        /**
         * 使用 Blob URL 替代 data: URL 以兼容严格的 CSP 策略
         * @see https://github.com/antvis/S2/issues/3125
         * 兼容 Firefox: https://github.com/antvis/S2/issues/1571
         */
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);

        // 加载完成后释放 Blob URL 以防止内存泄漏
        const originalOnload = img.onload;

        img.onload = (event) => {
          URL.revokeObjectURL(blobUrl);
          originalOnload?.call(img, event);
        };

        const originalOnerror = img.onerror;

        img.onerror = (event) => {
          URL.revokeObjectURL(blobUrl);

          if (typeof originalOnerror === 'function') {
            originalOnerror.call(img, event);
          }
        };

        img.src = blobUrl;
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
    const { name, fill, iconStrategy } = this.cfg;

    // 如果指定了 path 模式，优先尝试 Path 模式 (完全绕过 CSP 限制)
    if (iconStrategy === 'path' && this.tryRenderAsPath(name, fill)) {
      this.usePathMode = true;

      return;
    }

    // 默认或失败时回退到 Image 模式
    this.usePathMode = false;
    const attrs = clone(this.cfg);
    const image = new CustomImage(GuiIcon.type, {
      style: omit(attrs, ['fill', 'iconStrategy']),
    });

    this.iconImageShape = image;
    this.setImageAttrs({ name, fill });
  }

  public reRender(cfg: GuiIconCfg) {
    this.name = cfg.name;
    this.cfg = cfg;
    const { name, fill, iconStrategy } = this.cfg;

    // 清除旧的渲染
    if (this.usePathMode) {
      this.iconPathShapes.forEach((shape) => {
        this.removeChild(shape);
        shape.destroy();
      });
      this.iconPathShapes = [];
    }

    // 如果指定了 path 模式，优先尝试 Path 模式
    if (iconStrategy === 'path' && this.tryRenderAsPath(name, fill)) {
      this.usePathMode = true;

      return;
    }

    // 回退到 Image 模式
    this.usePathMode = false;
    const attrs = clone(this.cfg);

    if (!this.iconImageShape) {
      this.iconImageShape = new CustomImage(GuiIcon.type, {
        style: omit(attrs, ['fill', 'iconStrategy']),
      });
    } else {
      this.iconImageShape.imgType = GuiIcon.type;
      batchSetStyle(this.iconImageShape, omit(attrs, ['fill', 'iconStrategy']));
    }

    this.setImageAttrs({ name, fill });
  }

  public updatePosition(position: PointLike) {
    if (this.usePathMode) {
      const { width, height } = this.cfg;
      const parsedData = PathDataCache[this.cfg.name];

      if (parsedData) {
        const numWidth = typeof width === 'number' ? width : 0;
        const numHeight = typeof height === 'number' ? height : 0;
        const scaleX = numWidth / parsedData.viewBox.width;
        const scaleY = numHeight / parsedData.viewBox.height;

        this.iconPathShapes.forEach((shape) => {
          shape.style.transform = `translate(${position.x}, ${position.y}) scale(${scaleX}, ${scaleY})`;
        });
      }
    } else if (this.iconImageShape) {
      batchSetStyle(this.iconImageShape, position);
    }
  }

  public setImageAttrs(attrs: Partial<{ name: string; fill: string | null }>) {
    // Path 模式下直接更新 fill
    if (this.usePathMode) {
      const fill = attrs.fill || this.cfg.fill || '#000';

      // 第一个元素是透明热区 (hitAreaRect)，应保持透明，从第二个开始更新 fill
      this.iconPathShapes.slice(1).forEach((shape) => {
        shape.style.fill = fill;
      });

      return;
    }

    // Image 模式
    let { name, fill } = attrs;
    const { iconImageShape: image } = this;

    if (!image) {
      return;
    }

    // 保证 name 和 fill 都有值
    name = name || this.cfg.name;
    fill = fill || this.cfg.fill;

    const cacheKey = `${name}-${fill}`;
    const imgCache = ImageCache[cacheKey];

    if (imgCache) {
      // already in cache
      image.attr('src', imgCache);
      this.appendChild(image);
    } else {
      this.getImage(name, cacheKey, fill)
        .then((img: HTMLImageElement) => {
          // 异步加载完成后，当前 Cell 可能已经销毁了
          if (this.destroyed) {
            DebuggerUtil.getInstance().logger(`GuiIcon ${name} destroyed.`);

            return;
          }

          image.attr('src', img);
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

  /**
   * https://github.com/antvis/S2/issues/2772
   * G 6.0 如果是多图层, 需要手动全部隐藏, 直接隐藏父容器 Group 还不行, 或者使用 icon.show()
   * https://github.com/antvis/G/blob/277abff24936ef6f7c43407a16c5bc9260992511/packages/g-lite/src/display-objects/DisplayObject.ts#L853
   */
  public toggleVisibility(visible: boolean) {
    const status = visible ? 'visible' : 'hidden';

    this.setAttribute('visibility', status);

    if (this.usePathMode) {
      this.iconPathShapes.forEach((shape) => {
        shape.style.visibility = status;
      });
    } else if (this.iconImageShape) {
      this.iconImageShape.setAttribute('visibility', status);
    }
  }
}
