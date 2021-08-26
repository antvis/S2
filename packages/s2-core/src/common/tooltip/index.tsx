import {
  ListItem,
  TooltipData,
  TooltipOperatorOptions,
  TooltipOptions,
  TooltipPosition,
  TooltipShowOptions,
  TooltipSummaryOptions,
  TooltipHeadInfo as TooltipHeadInfoType,
} from '@/common/interface';
import { isEmpty } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { SpreadSheet } from 'src/sheet-type';
import {
  getOptions,
  getPosition,
  manageContainerStyle,
  shouldIgnore,
} from '@/utils/tooltip';
import { Aggregation } from '../interface';
import TooltipDetail from './components/detail';
import Divider from './components/divider';
import TooltipHeadInfo from './components/head-info';
import Infos from './components/infos';
import Interpretation from './components/interpretation';
import TooltipOperator from './components/operator';
import SimpleTips from './components/simple-tips';
import TooltipSummary from './components/summary';
import { TOOLTIP_PREFIX_CLS } from './constant';
import './index.less';

/**
 * Base tooltips component
 */
export class BaseTooltip {
  public spreadsheet: SpreadSheet; // the type of Spreadsheet

  public aggregation: Aggregation = 'SUM'; // the type of aggregation, 'SUM' by default

  public container: HTMLElement; // the base container element

  private customComponent: React.Component | Element | void; // react component

  private enterable = false; // mark if can enter into tooltips

  public position: TooltipPosition = { x: 0, y: 0 }; // tooltips position info

  constructor(spreadsheet: SpreadSheet, aggregation?: Aggregation) {
    this.spreadsheet = spreadsheet;
    this.aggregation = aggregation || 'SUM';
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

    if (this.enterable && shouldIgnore(enterable, position, this.position)) {
      return;
    }
    this.enterable = enterable;

    manageContainerStyle(container, {
      pointerEvents: enterable ? 'all' : 'none',
      display: 'inline-block',
    });

    this.unMountComponent(container);
    const customDom =
      element ||
      (this.spreadsheet?.options?.tooltipComponent as React.DOMElement<
        React.DOMAttributes<Element>,
        Element
      >);
    this.customComponent = customDom
      ? ReactDOM.render(customDom, container)
      : ReactDOM.render(this.renderContent(data, options), container);
    const { x, y } = getPosition(position, this.container);

    this.position = {
      x,
      y,
    };

    manageContainerStyle(container, { left: `${x}px`, top: `${y}px` });
  }

  /**
   * Hide toolTips
   */
  public hide() {
    const container = this.getContainer();
    manageContainerStyle(container, { pointerEvents: 'none', display: 'none' });
    this.enterable = false;
    this.resetPosition();
    this.unMountComponent(container);
  }

  public destroy() {
    if (this.container) {
      this.resetPosition();
      document.body.removeChild(this.container);
    }
  }

  private resetPosition() {
    this.position = { x: 0, y: 0 };
  }

  protected renderContent(data?: TooltipData, options?: TooltipOptions) {
    const option = getOptions(options);
    const { operator, showSingleTips } = option;
    const { summaries, headInfo, details, interpretation, infos, tips } =
      data || {};

    if (showSingleTips) {
      return this.renderSimpleTips(tips);
    }
    return (
      <div>
        {this.renderOperation(operator)}
        {this.renderSummary(summaries)}
        {this.renderInterpretation(interpretation)}
        {this.renderHeadInfo(headInfo)}
        {this.renderDetail(details)}
        {this.renderInfos(infos)}
      </div>
    );
  }

  protected renderDivider() {
    return <Divider />;
  }

  protected renderOperation(operator: TooltipOperatorOptions) {
    return (
      operator && (
        <TooltipOperator onClick={operator.onClick} menus={operator.menus} />
      )
    );
  }

  protected renderSimpleTips(tips: string) {
    return tips && <SimpleTips tips={tips} />;
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
          <TooltipHeadInfo cols={cols} rows={rows} />
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

  protected renderInterpretation(interpretation) {
    return interpretation && <Interpretation {...interpretation} />;
  }

  /**
   * ToolTips container element
   */
  protected getContainer(): HTMLElement {
    if (!this.container) {
      // create a new div as container
      const container = document.createElement('div');
      document.body.appendChild(container);
      this.container = container;
    }
    // change class every time!
    this.container.className = `${TOOLTIP_PREFIX_CLS}-container`;
    return this.container;
  }

  protected unMountComponent(container?: HTMLElement) {
    if (this.customComponent) {
      ReactDOM.unmountComponentAtNode(container);
    }
  }
}
