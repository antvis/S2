import { isNil } from 'lodash';
import type { SpreadSheet } from '@/sheet-type';
import {
  TooltipContentType,
  TooltipPosition,
  TooltipShowOptions,
} from '@/common/interface';
import {
  getTooltipDefaultOptions,
  getAutoAdjustPosition,
  setContainerStyle,
} from '@/utils/tooltip';
import {
  TOOLTIP_PREFIX_CLS,
  TOOLTIP_CONTAINER_CLS,
} from '@/common/constant/tooltip';

import './index.less';

/**
 * Base tooltips component
 */
export class BaseTooltip {
  public spreadsheet: SpreadSheet; // the type of Spreadsheet

  public container: HTMLElement; // the base container element

  public options: TooltipShowOptions;

  public position: TooltipPosition = { x: 0, y: 0 }; // tooltips position info

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  /**
   * Show toolTips
   * @param position
   * @param data
   * @param options {@link TooltipOptions}
   * @param content
   */
  public show<T = Element | string>(showOptions: TooltipShowOptions<T>) {
    const { position, options, content } = showOptions;
    const { enterable } = getTooltipDefaultOptions(options);
    const container = this.getContainer();
    const { autoAdjustBoundary } = this.spreadsheet.options.tooltip || {};

    this.options = showOptions as unknown as TooltipShowOptions;

    this.renderContent<T>(content as T);

    const { x, y } = getAutoAdjustPosition({
      spreadsheet: this.spreadsheet,
      position,
      tooltipContainer: container,
      autoAdjustBoundary,
    });

    this.position = {
      x,
      y,
    };

    setContainerStyle(container, {
      style: {
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: enterable ? 'all' : 'none',
      },
      className: `${TOOLTIP_CONTAINER_CLS}-show`,
    });
  }

  public hide() {
    if (!this.container) {
      return;
    }
    const container = this.getContainer();
    setContainerStyle(container, {
      style: {
        pointerEvents: 'none',
      },
      className: `${TOOLTIP_CONTAINER_CLS}-hide`,
    });
    this.resetPosition();
  }

  public destroy() {
    const container = this.getContainer();
    if (container) {
      this.resetPosition();
      container.remove?.();
    }
  }

  public renderContent<T = TooltipContentType>(content: T) {
    this.clearContent();

    const { content: contentFromOptions } =
      this.spreadsheet.options.tooltip || {};
    const container = this.getContainer();
    const displayContent = content ?? contentFromOptions;

    // 兼容 displayContent = '' 空字符串的场景
    if (isNil(displayContent)) {
      return;
    }

    if (typeof displayContent === 'string') {
      container.innerHTML = displayContent;
      return;
    }

    if (displayContent instanceof Element) {
      container.appendChild(displayContent as Element);
    }
  }

  public clearContent() {
    const container = this.getContainer();
    container.innerHTML = '';
  }

  public disablePointerEvent() {
    if (!this.container) {
      return;
    }

    if (this.container.style.pointerEvents === 'none') {
      return;
    }
    setContainerStyle(this.container, {
      style: {
        pointerEvents: 'none',
      },
    });
  }

  private resetPosition() {
    this.position = { x: 0, y: 0 };
  }

  /**
   * ToolTips container element
   */
  protected getContainer(): HTMLElement {
    if (!this.container) {
      const rootContainer =
        this.spreadsheet.options.tooltip.getContainer?.() || document.body;

      const container = document.createElement('div');
      rootContainer.appendChild(container);

      this.container = container;
    }
    this.container.className = `${TOOLTIP_PREFIX_CLS}-container`;
    return this.container;
  }
}
