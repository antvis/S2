import { isEmpty } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Aggregation } from '../interface';
import { BaseSpreadSheet } from '../../sheet-type';
import { TooltipDetail } from './components/detail';
import { Operator as TooltipOperator } from './components/operator';
import { Infos } from './components/infos';
import { TooltipSummary } from './components/summary';
import { TooltipHeadInfo } from './components/head-info';
import { Interpretation } from './components/interpretation';
import {
  DataItem,
  ListItem,
  Position,
  SummaryProps,
  TooltipOptions,
  HeadInfo,
  ShowProps,
} from './interface';
import {
  getPosition,
  getOptions,
  shouldIgnore,
  manageContainerStyle,
} from '../../utils/tooltip';
import { CONTAINER_CLASS, DIVIDER_CLASS } from './constant';

import './index.less';

/**
 * Base tooltips component
 */
export abstract class BaseTooltip {
  // the type of Spreadsheet
  public spreadsheet: BaseSpreadSheet;
  // the type of aggregation, 'SUM' by default
  public aggregation: Aggregation = 'SUM';
  // the base container element
  protected container: HTMLElement;
  // react component
  private _tooltipComponent: any;
  // mark if can enter into tooltips
  private enterable: boolean = false;
  // tooltips position info
  protected position: Position = { x: 0, y: 0 };

  constructor(plot: BaseSpreadSheet, aggregation: Aggregation = 'SUM') {
    this.spreadsheet = plot;
    this.aggregation = aggregation;
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
    } else {
      this.enterable = enterable;
      this.position = position;
    }

    manageContainerStyle(container, {
      pointerEvents: enterable ? 'all' : 'none',
      display: 'inline-block',
    });

    this.unMountComponent(container);
    this._tooltipComponent = element
      ? ReactDOM.render(element, container)
      : ReactDOM.render(this.renderContent(data, options), container); // 内容渲染完成后在调整位置
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

  protected renderContent(data?: DataItem, options?: TooltipOptions) {
    const _options = getOptions(options);
    const operation = this.renderOperation(_options);
    const summary = this.renderSummary(data, _options);
    const interpretation = this.renderInterpretation(_options);
    const detail = this.renderDetail(data, _options);
    const headInfo = this.renderHeadInfo(data, _options);
    const infos = this.renderInfos(_options);
    return (
      <div>
        {operation}
        {summary}
        {interpretation}
        {headInfo}
        {detail}
        {infos}
      </div>
    );
  }

  protected renderDivider() {
    return <div className={DIVIDER_CLASS} />;
  }

  protected renderOperation(options?: TooltipOptions) {
    const { operator } = options;

    return (
      operator && (
        <TooltipOperator onClick={operator.onClick} menus={operator.menus} />
      )
    );
  }

  protected renderSummary(data: DataItem, options: TooltipOptions) {
    const props = this.getSummaryProps(data, options);

    return !isEmpty(props) && <TooltipSummary {...props} />;
  }

  protected renderHeadInfo(data: DataItem, options: TooltipOptions) {
    const { cols, rows } = this.getHeadInfo(data, options);

    return (
      (!isEmpty(cols) || !isEmpty(rows)) && (
        <>
          {this.renderDivider()}
          <TooltipHeadInfo cols={cols} rows={rows} />
        </>
      )
    );
  }

  protected renderDetail(data?: DataItem, options?: TooltipOptions) {
    const detailList = this.getDetailList(data, options);

    return !isEmpty(detailList) && <TooltipDetail list={detailList} />;
  }

  protected renderInfos(options?: TooltipOptions) {
    const { infos } = options || {};

    return infos && <Infos infos={infos} />;
  }

  protected renderInterpretation(options?: TooltipOptions) {
    const { interpretation } = options;

    return interpretation && <Interpretation {...interpretation} />;
  }

  protected abstract getHeadInfo(
    hoverData: DataItem,
    options?: TooltipOptions,
  ): HeadInfo;

  protected abstract getDetailList(
    hoverData: DataItem,
    options: TooltipOptions,
  ): ListItem[];

  protected abstract getSummaryProps(
    hoverData: DataItem,
    options: TooltipOptions,
  ): SummaryProps;

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
    this.container.className = CONTAINER_CLASS;
    return this.container;
  }

  protected unMountComponent(container?: HTMLElement) {
    if (this._tooltipComponent) {
      ReactDOM.unmountComponentAtNode(container);
    }
  }
}
