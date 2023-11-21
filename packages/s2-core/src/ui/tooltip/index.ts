import { isNil } from 'lodash';
import { TOOLTIP_CONTAINER_CLS } from '../../common/constant/tooltip';
import type {
  BaseTooltipOperatorMenuOptions,
  TooltipContentType,
  TooltipPosition,
  TooltipShowOptions,
} from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import {
  getAutoAdjustPosition,
  setTooltipContainerStyle,
} from '../../utils/tooltip';

import './index.less';

/**
 * Tooltip 基类
 * @see https://s2.antv.antgroup.com/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89
 * @example
 * import CustomTooltip extends BaseTooltip {
      renderContent() {}
      show() {}
      hide() {}
      destroy() {}
  }
 */
export class BaseTooltip<
  Content = TooltipContentType,
  Menu = BaseTooltipOperatorMenuOptions,
> {
  public visible = false;

  public spreadsheet: SpreadSheet;

  public container: HTMLElement | null;

  public options: TooltipShowOptions<Content, Menu>;

  public position: TooltipPosition = { x: 0, y: 0 };

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  public show<T = Content, M = Menu>(options: TooltipShowOptions<T, M>) {
    const { position, content, event } = options;
    const { autoAdjustBoundary, adjustPosition } =
      this.spreadsheet.options.tooltip || {};

    this.visible = true;
    this.options = options as unknown as TooltipShowOptions<Content, Menu>;
    const container = this.getContainer();

    this.renderContent<T>(content as T);

    const { x, y } = getAutoAdjustPosition({
      spreadsheet: this.spreadsheet,
      position,
      tooltipContainer: container,
      autoAdjustBoundary,
    });

    this.position = adjustPosition?.({ position: { x, y }, event: event! }) ?? {
      x,
      y,
    };

    setTooltipContainerStyle(container, {
      style: {
        left: `${this.position?.x}px`,
        top: `${this.position?.y}px`,
        pointerEvents: 'all',
      },
      visible: true,
    });
  }

  public hide() {
    this.visible = false;

    if (!this.container) {
      return;
    }

    setTooltipContainerStyle(this.container, {
      style: {
        pointerEvents: 'none',
      },
      visible: false,
    });
    this.resetPosition();
  }

  public destroy() {
    this.visible = false;

    if (!this.container) {
      return;
    }

    this.resetPosition();
    this.container.remove?.();
    this.container = null;
  }

  public renderContent<T = TooltipContentType>(content: T) {
    if (!this.container) {
      return;
    }

    this.clearContent();

    const { content: contentFromOptions } =
      this.spreadsheet.options.tooltip || {};
    const displayContent = content ?? contentFromOptions;

    // 兼容 displayContent = '' 空字符串的场景
    if (isNil(displayContent)) {
      return;
    }

    if (typeof displayContent === 'string') {
      this.container.innerHTML = displayContent;
      this.options.onMounted?.();

      return;
    }

    if (displayContent instanceof Element) {
      this.container.appendChild(displayContent as Element);
      this.options.onMounted?.();
    }
  }

  public clearContent() {
    if (!this.container) {
      return;
    }

    this.container.innerHTML = '';
  }

  public disablePointerEvent() {
    if (!this.container) {
      return;
    }

    if (this.container.style.pointerEvents === 'none') {
      return;
    }

    setTooltipContainerStyle(this.container, {
      style: {
        pointerEvents: 'none',
      },
    });
  }

  private resetPosition() {
    this.position = { x: 0, y: 0 };
  }

  private getContainer(): HTMLElement {
    if (!this.container) {
      const { tooltip } = this.spreadsheet.options;
      const rootContainer = tooltip?.getContainer?.() || document.body;
      const container = document.createElement('div');

      setTooltipContainerStyle(container, {
        style: tooltip?.style,
        className: [TOOLTIP_CONTAINER_CLS].concat(tooltip?.className!),
      });

      rootContainer.appendChild(container);

      this.container = container;

      return this.container;
    }

    return this.container;
  }
}
