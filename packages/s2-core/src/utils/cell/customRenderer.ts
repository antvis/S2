import { Image as GImage, HTML } from '@antv/g';
import type { BaseCell } from '../../cell';
import { CellRendererType } from '../../common/constant/renderer';
import { CellClipBox } from '../../common/interface/basic';
import { CustomRendererConfig } from '../../common/interface/renderer';

const defaultVideoConfig = {
  loop: true,
  autoplay: true,
  crossOrigin: true,
  controls: false,
  muted: true,
};

const mediaCache = new Map<string, HTMLElement | null>();
const loadError = new Error('Failed to load image and fallback');

export function asyncDrawImage(
  src: string,
  fallback?: string,
  timeout: number = 10000,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (mediaCache.has(src)) {
      const cacheImg = mediaCache.get(src);

      if (cacheImg) {
        resolve(mediaCache.get(src) as HTMLImageElement);
      } else {
        reject(loadError);
      }

      return;
    }

    const cacheResolve = (img: HTMLImageElement) => {
      mediaCache.set(src, img);
      resolve(img);
    };

    const cacheReject = (error: Error) => {
      mediaCache.set(src, null);
      reject(error);
    };

    const img = new Image();
    const onerror = () => {
      if (fallback) {
        // 如果加载失败，尝试 fallback
        asyncDrawImage(fallback, undefined, timeout)
          .then(cacheResolve)
          .catch(cacheReject);
      } else {
        // 如果没有 fallback 或者 fallback 也失败，返回错误
        cacheReject(loadError);
      }
    };

    img.src = src;
    img.crossOrigin = 'Anonymous';

    // 设置超时
    const timeoutId = setTimeout(onerror, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      cacheResolve(img);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      onerror();
    };
  });
}

/**
 * 计算图片最佳缩放尺寸
 * @param {number} containerWidth 容器宽度
 * @param {number} containerHeight 容器高度
 * @param {number} naturalWidth 图片原始宽度
 * @param {number} naturalHeight 图片原始高度
 * @returns {{ width: number, height: number }}
 */
export function calculateImageSize(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
): { width: number; height: number } {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return {
      width: 0,
      height: 0,
    };
  }

  if (naturalWidth <= 0 || naturalHeight <= 0) {
    return {
      width: containerWidth,
      height: containerHeight,
    };
  }

  // 计算宽高比例限制
  const widthRatio = containerWidth / naturalWidth;
  const heightRatio = containerHeight / naturalHeight;

  // 取最小值防止溢出
  const scale = Math.min(widthRatio, heightRatio);

  // 返回整数尺寸 (避免亚像素模糊)
  return {
    width: Math.floor(naturalWidth * scale),
    height: Math.floor(naturalHeight * scale),
  };
}

export async function drawCustomCellRenderer(
  renderer: CustomRendererConfig,
  cell: BaseCell<any>,
) {
  const fieldValue = cell.getFieldValue();
  const text = fieldValue?.toString() ?? '';
  // eslint-disable-next-line prefer-const
  let { x, y, height, width } = cell.getBBoxByType(CellClipBox.CONTENT_BOX);

  let element;

  switch (renderer.type) {
    case CellRendererType.IMAGE: {
      // 图片加载成功后创建
      const htmlImageElement = await asyncDrawImage(
        text,
        renderer.fallback,
        renderer.timeout,
      );

      const { width: calcWidth, height: calcHeight } = calculateImageSize(
        width,
        height,
        htmlImageElement.naturalWidth,
        htmlImageElement.naturalHeight,
      );

      const { x: calcX } = cell.getContentPosition({
        contentWidth: calcWidth,
      });

      element = new GImage({
        style: {
          x: calcX,
          y,
          src: htmlImageElement,
          width: calcWidth,
          height: calcHeight,
          ...renderer.config,
        },
      });

      break;
    }
    case CellRendererType.VIDEO: {
      const video = document.createElement('video');

      const config = {
        height,
        width,
        ...defaultVideoConfig,
        ...renderer.config,
        src: text,
      };

      Object.assign(video, config);
      element = new HTML({
        style: {
          x,
          y,
          innerHTML: video,
          pointerEvents: 'none',
        },
      });
      break;
    }
    case CellRendererType.HTML: {
      element = new HTML({
        style: {
          x,
          y,
          innerHTML: text,
          pointerEvents: 'auto',
          ...renderer.config,
        },
      });
      break;
    }
    default:
  }
  if (element) {
    cell.appendChild(element);
  }
}
