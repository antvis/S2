import { SpreadSheet } from '@/sheet-type';
import { TooltipPosition, TooltipShowOptions } from '@/common/interface';
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
   * @param element
   */
  public show(showOptions: TooltipShowOptions) {
    const { position, options, element } = showOptions;
    const { enterable } = getTooltipDefaultOptions(options);
    const container = this.getContainer();
    const { tooltipComponent, getTooltipComponent, autoAdjustBoundary } =
      this.spreadsheet.options.tooltip || {};

    if (getTooltipComponent) {
      getTooltipComponent(showOptions, container);
    } else {
      const customComponent = element || tooltipComponent;
      if (customComponent) {
        if (typeof customComponent === 'string') {
          this.container.innerHTML = customComponent;
        } else {
          this.container.appendChild(customComponent);
        }
      }
    }

    this.options = showOptions;

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
    if (this.container) {
      this.resetPosition();
      document.body.removeChild(this.container);
    }
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
      const container = document.createElement('div');
      document.body.appendChild(container);
      this.container = container;
    }
    this.container.className = `${TOOLTIP_PREFIX_CLS}-container`;
    return this.container;
  }
}
