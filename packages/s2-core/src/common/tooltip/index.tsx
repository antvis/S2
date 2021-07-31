import { isEmpty } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Aggregation } from '../interface';
import TooltipDetail from './components/detail';
import TooltipOperator from './components/operator';
import Infos from './components/infos';
import Divider from './components/divider';
import TooltipSummary from './components/summary';
import TooltipHeadInfo from './components/head-info';
import Interpretation from './components/interpretation';
import SimpleTips from './components/simple-tips';
import {
  ListItem,
  Position,
  SummaryProps,
  TooltipOptions,
  HeadInfo,
  ShowProps,
  OperatorProps,
  DataProps,
} from '@/common/interface';
import {
  getPosition,
  getOptions,
  shouldIgnore,
  manageContainerStyle,
} from '../../utils/tooltip';
import { TOOLTIP_CLASS_PRE } from './constant';

import './index.less';
import { SpreadSheet } from 'src/sheet-type';

/**
 * Base tooltips component
 */
export class BaseTooltip {
  public spreadsheet: SpreadSheet; // the type of Spreadsheet

  public aggregation: Aggregation = 'SUM'; // the type of aggregation, 'SUM' by default

  protected container: HTMLElement; // the base container element

  private customComponent: any; // react component

  private enterable = false; // mark if can enter into tooltips

  protected position: Position = { x: 0, y: 0 }; // tooltips position info

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
  public show(showOptions: ShowProps) {
    const { position, data, options, element } = showOptions;
    const { enterable } = getOptions(options);
    const container = this.getContainer();

    if (this.enterable && shouldIgnore(enterable, position, this.position)) {
      return;
    }
    this.enterable = enterable;
    this.position = position;

    manageContainerStyle(container, {
      pointerEvents: enterable ? 'all' : 'none',
      display: 'inline-block',
    });

    this.unMountComponent(container);
    const customDom = element || this.spreadsheet?.options?.tooltipComponent;
    this.customComponent = customDom
      ? ReactDOM.render(customDom, container)
      : ReactDOM.render(this.renderContent(data, options), container);
    const { x, y } = getPosition(position, this.container);

    manageContainerStyle(container, { left: `${x}px`, top: `${y}px` });
  }

  /**
   * Hide toolTips
   */
  public hide() {
    const container = this.getContainer();
    manageContainerStyle(container, { pointerEvents: 'none', display: 'none' });
    this.enterable = false;
    this.position = { x: 0, y: 0 };
    this.unMountComponent(container);
  }

  public destroy() {
    if (this.container) {
      document.body.removeChild(this.container);
    }
  }

  protected renderContent(data?: DataProps, options?: TooltipOptions) {
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

  protected renderOperation(operator: OperatorProps) {
    return (
      operator && (
        <TooltipOperator onClick={operator.onClick} menus={operator.menus} />
      )
    );
  }

  protected renderSimpleTips(tips: string) {
    return tips && <SimpleTips tips={tips} />;
  }

  protected renderSummary(summaries: SummaryProps[]) {
    return !isEmpty(summaries) && <TooltipSummary summaries={summaries} />;
  }

  protected renderHeadInfo(headInfo: HeadInfo) {
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
    this.container.className = `${TOOLTIP_CLASS_PRE}-container`;
    return this.container;
  }

  protected unMountComponent(container?: HTMLElement) {
    if (this.customComponent) {
      ReactDOM.unmountComponentAtNode(container);
    }
  }
}
