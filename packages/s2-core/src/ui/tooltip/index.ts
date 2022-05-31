import { isNil } from 'lodash';
import {
  TOOLTIP_CONTAINER_CLS,
  TOOLTIP_PREFIX_CLS,
} from '../../common/constant/tooltip';
import {
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

  /**
   * Show toolTips
   * @param position
   * @param data
   * @param options {@link TooltipOptions}
   * @param content
   */
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
      className: `${TOOLTIP_CONTAINER_CLS}-show`,
    });
  }

  public hide() {
    this.visible = false;

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
    this.visible = false;
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
