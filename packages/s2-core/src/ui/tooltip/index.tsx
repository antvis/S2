import { isEmpty } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { InterceptType } from '@/common/constant/interaction';
import { SpreadSheet } from '@/sheet-type';
import {
  ListItem,
  TooltipData,
  TooltipOperatorOptions,
  TooltipOptions,
  TooltipPosition,
  TooltipShowOptions,
  TooltipSummaryOptions,
  TooltipNameTipsOptions,
  TooltipHeadInfo as TooltipHeadInfoType,
  TooltipInterpretationOptions,
} from '@/common/interface';
import { getOptions, getPosition, setContainerStyle } from '@/utils/tooltip';
import { TooltipDetail } from '@/ui/tooltip/components/detail';
import { Divider } from '@/ui/tooltip/components/divider';
import { TooltipHead } from '@/ui/tooltip/components/head-info';
import { Infos } from '@/ui/tooltip/components/infos';
import { Interpretation } from '@/ui/tooltip/components/interpretation';
import { TooltipOperator } from '@/ui/tooltip/components/operator';
import { SimpleTips } from '@/ui/tooltip/components/simple-tips';
import { TooltipSummary } from '@/ui/tooltip/components/summary';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';

import './index.less';

/**
 * Base tooltips component
 */
export class BaseTooltip {
  public spreadsheet: SpreadSheet; // the type of Spreadsheet

  public container: HTMLElement; // the base container element

  protected options: TooltipShowOptions;

  private renderElement: React.Component | Element | void; // react component

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
    const { position, data, options, element } = showOptions;
    const { enterable } = getOptions(options);
    const container = this.getContainer();

    const CustomComponent =
      element || this.spreadsheet.options.tooltip?.tooltipComponent;

    this.options = showOptions;
    this.renderElement = CustomComponent
      ? ReactDOM.render(CustomComponent, container)
      : ReactDOM.render(this.renderContent(data, options), container);

    const { x, y } = getPosition(position, container);

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
    this.unMountComponent(container);
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

  protected renderContent(data?: TooltipData, options?: TooltipOptions) {
    const option = getOptions(options);
    const { operator, onlyMenu } = option;
    const { summaries, headInfo, details, interpretation, infos, tips, name } =
      data || {};
    const nameTip = { name, tips };

    if (onlyMenu) {
      return this.renderOperation(operator, true);
    }
    return (
      <>
        {this.renderOperation(operator)}
        {this.renderNameTips(nameTip)}
        {this.renderSummary(summaries)}
        {this.renderInterpretation(interpretation)}
        {this.renderHeadInfo(headInfo)}
        {this.renderDetail(details)}
        {this.renderInfos(infos)}
      </>
    );
  }

  protected renderDivider() {
    return <Divider />;
  }

  protected renderOperation(
    operator: TooltipOperatorOptions,
    onlyMenu?: boolean,
  ) {
    return (
      operator && (
        <TooltipOperator
          onClick={operator.onClick}
          menus={operator.menus}
          onlyMenu={onlyMenu}
        />
      )
    );
  }

  protected renderNameTips(nameTip: TooltipNameTipsOptions) {
    const { name, tips } = nameTip || {};
    return <SimpleTips name={name} tips={tips} />;
  }

  protected renderSummary(summaries: TooltipSummaryOptions[]) {
    return !isEmpty(summaries) && <TooltipSummary summaries={summaries} />;
  }

  protected renderHeadInfo(headInfo: TooltipHeadInfoType) {
    const { cols, rows } = headInfo || {};

    return (
      (!isEmpty(cols) || !isEmpty(rows)) && (
        <>
          {this.renderDivider()}
          <TooltipHead cols={cols} rows={rows} />
        </>
      )
    );
  }

  protected renderDetail(details: ListItem[]) {
    return !isEmpty(details) && <TooltipDetail list={details} />;
  }

  protected renderInfos(infos: string) {
    return infos && <Infos infos={infos} />;
  }

  protected renderInterpretation(interpretation: TooltipInterpretationOptions) {
    return interpretation && <Interpretation {...interpretation} />;
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

  protected unMountComponent(container?: HTMLElement) {
    if (this.renderElement) {
      ReactDOM.unmountComponentAtNode(container);
    }
  }
}
