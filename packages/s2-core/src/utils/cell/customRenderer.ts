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

function asyncDrawImage(
  src: string,
  fallback?: string,
  timeout: number = 5000,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const handleTimeout = () => {
      reject(new Error('Image loading timed out'));
    };

    img.src = src;
    img.crossOrigin = 'Anonymous';

    // 设置超时
    const timeoutId = setTimeout(handleTimeout, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      if (fallback) {
        // 如果加载失败，尝试 fallback
        asyncDrawImage(fallback, undefined, timeout)
          .then(resolve)
          .catch(reject);
      } else {
        // 如果没有 fallback 或者 fallback 也失败，返回错误
        reject(new Error('Failed to load image and fallback'));
      }
    };
  });
}

export async function drawCustomCellRenderer(
  renderer: CustomRendererConfig,
  cell: BaseCell<any>,
) {
  const fieldValue = cell.getFieldValue();
  const text = fieldValue?.toString() ?? '';
  const { x, y, height, width } = cell.getBBoxByType(CellClipBox.CONTENT_BOX);
  let config: CustomRendererConfig['config'] = { ...renderer.config };

  if (!config.height && !config.width) {
    config.height = height;
  }

  let element;

  switch (renderer.type) {
    case CellRendererType.IMAGE: {
      // 图片加载成功后创建
      element = new GImage({
        style: {
          x,
          y,
          keepAspectRatio: true,
          src: await asyncDrawImage(text, renderer.fallback),
          ...config,
        },
      });
      break;
    }
    case CellRendererType.VIDEO: {
      const video = document.createElement('video');

      config = { height, width, ...defaultVideoConfig, ...config, src: text };
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
          ...config,
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
