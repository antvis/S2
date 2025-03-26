import type { BaseCell } from '../cell';
import { CellRendererType } from '../common/constant/renderer';
import { CustomRendererConfig } from '../common/interface';
import { SimpleBBox } from '../engine';
import { BaseRenderer } from './BaseRenderer';
import { ImageRenderer } from './ImageRenderer';
import { VideoRenderer } from './VideoRenderer';

export class SingletonRenderer {
  private static instances = new Map<string, BaseRenderer>();

  static getInstance<T extends BaseRenderer>(type: CellRendererType): T {
    if (!SingletonRenderer.instances.has(type)) {
      let renderer;

      switch (type) {
        case CellRendererType.IMAGE: {
          renderer = new ImageRenderer();
          break;
        }
        case CellRendererType.VIDEO: {
          renderer = new VideoRenderer();
          break;
        }
        default: {
          renderer = null;
        }
      }
      if (renderer) {
        SingletonRenderer.instances.set(type, renderer);
      }
    }

    return SingletonRenderer.instances.get(type) as T;
  }

  static render(renderer: CustomRendererConfig, cell: BaseCell<SimpleBBox>) {
    return SingletonRenderer.getInstance(renderer.type).process(renderer, cell);
  }
}
