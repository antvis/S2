import { SpreadSheet } from '@/sheet-type';
import { TooltipPosition, TooltipShowOptions } from '@/common/interface';
import {
  getOptions,
  getAutoAdjustPosition,
  setContainerStyle,
} from '@/utils/tooltip';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';

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
    const { enterable } = getOptions(options);
    const container = this.getContainer();
    const { tooltipComponent, getTooltipComponent, autoAdjustBoundary } =
      this.spreadsheet.options.tooltip || {};

    if (getTooltipComponent) {
      getTooltipComponent(showOptions, container);
    } else {
      const customComponent = tooltipComponent || element;
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
      left: `${x}px`,
      top: `${y}px`,
      pointerEvents: enterable ? 'all' : 'none',
      visibility: 'visible',
    });
  }

  public hide() {
    const container = this.getContainer();
    setContainerStyle(container, {
      pointerEvents: 'none',
      visibility: 'hidden',
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
    if (this.container.style.pointerEvents === 'none') {
      return;
    }
    setContainerStyle(this.container, {
      pointerEvents: 'none',
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
    this.container.id = `${TOOLTIP_PREFIX_CLS}-container`;
    return this.container;
  }
}
