import { DisplayObjectConfig } from '@antv/g';
import type { BaseCell } from '../cell';
import { CellClipBox } from '../common/interface';
import { CustomRendererConfig } from '../common/interface/renderer';
import { SimpleBBox } from '../engine';

export abstract class BaseRenderer {
  static mediaCache = new Map<string, HTMLElement | null>();

  abstract prepare(
    renderer: CustomRendererConfig,
    cell: BaseCell<SimpleBBox>,
  ): Promise<HTMLElement | null>;

  abstract render(
    cell: BaseCell<SimpleBBox>,
    config: DisplayObjectConfig<CustomRendererConfig['config']>,
  ): void;

  abstract generateConfig(
    renderer: CustomRendererConfig,
    cell: BaseCell<SimpleBBox>,
    element: HTMLElement,
  ): DisplayObjectConfig<CustomRendererConfig['config']>;

  public async process(
    renderer: CustomRendererConfig,
    cell: BaseCell<SimpleBBox>,
  ) {
    const element = await this.prepare(renderer, cell);
    const config = this.generateConfig(renderer, cell, element!);

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
