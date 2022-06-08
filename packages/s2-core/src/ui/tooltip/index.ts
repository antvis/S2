import { isNil } from 'lodash';
import {
  TOOLTIP_CONTAINER_CLS,
  TOOLTIP_PREFIX_CLS,
} from '../../common/constant/tooltip';
import type {
  TooltipContentType,
  TooltipPosition,
  TooltipShowOptions,
} from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import {
  getAutoAdjustPosition,
  getTooltipDefaultOptions,
  setContainerStyle,
} from '../../utils/tooltip';
import './index.less';

/**
 * Base tooltips component
 */
export class BaseTooltip {
  public visible = false;

  public spreadsheet: SpreadSheet; // the type of Spreadsheet

  public container: HTMLElement; // the base container element

  public options: TooltipShowOptions;

  public position: TooltipPosition = { x: 0, y: 0 }; // tooltips position info

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  public show<T = Element | string>(showOptions: TooltipShowOptions<T>) {
    const { position, options, content, event } = showOptions;
    const { enterable } = getTooltipDefaultOptions(options);
    const container = this.getContainer();
    const { autoAdjustBoundary, adjustPosition } =
      this.spreadsheet.options.tooltip || {};
    this.visible = true;
    this.options = showOptions as unknown as TooltipShowOptions;

    this.renderContent<T>(content as T);

    const { x, y } = getAutoAdjustPosition({
      spreadsheet: this.spreadsheet,
      position,
      tooltipContainer: container,
      autoAdjustBoundary,
    });

    this.position = adjustPosition?.({ position: { x, y }, event }) ?? {
      x,
      y,
    };

    setContainerStyle(container, {
      style: {
        left: `${this.position?.x}px`,
        top: `${this.position?.y}px`,
        pointerEvents: enterable ? 'all' : 'none',
      },
      className: `${TOOLTIP_PREFIX_CLS}-container ${TOOLTIP_CONTAINER_CLS}-show`,
    });
  }

  public hide() {
    this.visible = false;

    if (!this.container) {
      return;
    }

    setContainerStyle(this.container, {
      style: {
        pointerEvents: 'none',
      },
      className: `${TOOLTIP_PREFIX_CLS}-container ${TOOLTIP_CONTAINER_CLS}-hide`,
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
      return;
    }

    if (displayContent instanceof Element) {
      this.container.appendChild(displayContent as Element);
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
    setContainerStyle(this.container, {
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
      const rootContainer =
        this.spreadsheet.options.tooltip.getContainer?.() || document.body;
      const container = document.createElement('div');
      container.className = `${TOOLTIP_PREFIX_CLS}-container`;
      rootContainer.appendChild(container);

      this.container = container;
      return this.container;
    }
    return this.container;
  }
}
