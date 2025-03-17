import { DisplayObjectConfig, Path } from '@antv/g';
import type { BaseCell } from '../cell';
import { CellClipBox } from '../common/interface';
import { CustomRendererConfig } from '../common/interface/renderer';
import { SimpleBBox } from '../engine';

export abstract class BaseRenderer {
  static mediaCache = new Map<string, HTMLElement | null>();

  abstract prepare(
    renderer: CustomRendererConfig,
    cell: BaseCell<SimpleBBox>,
  ): Promise<HTMLElement | string | null>;

  abstract render(
    cell: BaseCell<SimpleBBox>,
    config: DisplayObjectConfig<CustomRendererConfig['config']>,
  ): void;

  abstract generateConfig(
    renderer: CustomRendererConfig,
    cell: BaseCell<SimpleBBox>,
    element: HTMLElement | string,
  ): DisplayObjectConfig<CustomRendererConfig['config']>;

  protected getLoading(cell: BaseCell<SimpleBBox>) {
    const { x, y, height, width } = this.getCellInfo(cell);
    const r = Math.min(height, width) * 0.25;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const loadingLine = new Path({
      style: {
        d: `M${centerX} ${centerY - r}
           A${r} ${r} 0 0 1 ${centerX + r} ${centerY}`,
        stroke: cell.getIconStyle()?.fill,
        transformOrigin: `${centerX} ${centerY}`,
      },
    });

    cell.appendChild(loadingLine);

    setTimeout(() => {
      loadingLine.animate(
        [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }],
        {
          duration: 1000,
          iterations: Infinity,
        },
      );
    });

    return loadingLine;
  }

  public async process(
    renderer: CustomRendererConfig,
    cell: BaseCell<SimpleBBox>,
  ) {
    const loadingLine = this.getLoading(cell);
    const element = await this.prepare(renderer, cell);
    const config = this.generateConfig(renderer, cell, element!);

    cell.removeChild(loadingLine);
    loadingLine.destroy();
    this.render(cell, config);
  }

  public destroy() {}

  public getCellInfo(cell: BaseCell<SimpleBBox>) {
    const fieldValue = cell.getFieldValue();
    const text = fieldValue?.toString() ?? '';

    return {
      text,
      ...cell.getBBoxByType(CellClipBox.CONTENT_BOX),
    };
  }
}
