import { HTML, Image } from '@antv/g';
import type { BaseCell } from '../../cell';
import { RendererType } from '../../common/constant/renderer';
import { CellClipBox } from '../../common/interface/basic';
import { CustomRendererConfig } from '../../common/interface/renderer';

const defaultVideoConfig = {
  loop: true,
  autoplay: true,
  crossOrigin: true,
  controls: false,
  muted: true,
};

export function drawCustomRenderer(
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
    case RendererType.image: {
      element = new Image({
        style: {
          x,
          y,
          keepAspectRatio: true,
          src: text,
          ...config,
        },
      });
      break;
    }
    case RendererType.video: {
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
    case RendererType.html: {
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
