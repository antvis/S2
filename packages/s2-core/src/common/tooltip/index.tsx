import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Aggregation } from '../interface';
import { BaseSpreadSheet } from '../../sheet-type';
import { TooltipDetail } from './components/detail';
import { Operator as TooltipOperator } from './components/operator';
import { TooltipSummary } from './components/summary';
import './index.less';
import {
  DataItem,
  ListItem,
  Position,
  SummaryProps,
  TooltipOptions,
} from './interface';

const CONTAINER_CLASS = 'eva-facet-tooltip';
const DIVIDER_CLASS = 'eva-facet-tooltip-divider';
const PositionXOffset = 10;
const PositionYOffset = 10;

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
  private tooltipComponent: any;

  // mark if can enter into tooltips
  private enterable = false;

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
  public show(
    position: Position,
    data?: DataItem,
    options?: TooltipOptions,
    element?: React.ReactElement,
  ) {
    const { enterable } = this.getOptions(options);
    const container = this.getContainer(options);
    if (this.shouldIgnore(enterable, position)) {
      return;
    }
    this.enterable = enterable;
    this.position = position;

    container.style.pointerEvents = enterable ? 'all' : 'none';
    container.style.display = 'inline-block';

    if (this.tooltipComponent) {
      ReactDOM.unmountComponentAtNode(container);
    }
    this.tooltipComponent = element
      ? ReactDOM.render(this.renderComponent(element), container)
      : ReactDOM.render(this.renderContent(data, options), container);
    // 内容渲染完成后在调整位置
    const { x, y } = this.getPosition(position);
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
  }

  /**
   * Hide toolTips
   */
  public hide() {
    const container = this.getContainer();
    container.style.display = 'none';
    container.style.pointerEvents = 'none';
    this.enterable = false;
    this.position = { x: 0, y: 0 };
    if (this.tooltipComponent) {
      ReactDOM.unmountComponentAtNode(container);
    }
  }

  public destroy() {
    if (this.container) {
      document.body.removeChild(this.container);
    }
  }

  /** hover 的数据是否是选中的 */
  protected isHoverDataInSelectedData(
    selectedData: DataItem[],
    hoverData: DataItem,
  ): boolean {
    return _.some(selectedData, (dataItem: DataItem): boolean =>
      _.isEqual(dataItem, hoverData),
    );
  }

  /** 计算聚合值 */
  protected getAggregationValue(data, field: string): number {
    if (this.aggregation === 'SUM') {
      return _.sumBy(data, (datum) => {
        const v = _.get(datum, field, 0);
        return _.isNil(v) ? 0 : Number.parseFloat(v);
      });
    }
    return 0;
  }

  /** 是否显示概要信息 */
  protected shouldShowSummary(
    hoverData: DataItem,
    selectedData: DataItem[],
    options: TooltipOptions,
  ): boolean {
    const { actionType } = options;

    const showSummary =
      actionType === 'cellHover'
        ? this.isHoverDataInSelectedData(selectedData, hoverData)
        : true;

    return !_.isEmpty(selectedData) && showSummary;
  }

  protected renderContent(data?: DataItem, options?: TooltipOptions) {
    const optionsIn = this.getOptions(options);
    // FIXME: 若有性能瓶颈则考虑复用 tooltipComponent
    const operation = this.getOperation(data, optionsIn);
    const summary = this.getSummary(data, optionsIn);
    const detail = this.renderDetail(data, options);
    const divider =
      summary && detail ? <div className={DIVIDER_CLASS} /> : null;
    return (
      <div>
        {operation}
        {summary}
        {divider}
        {detail}
      </div>
    );
  }

  protected renderComponent(element?: React.ReactElement) {
    return element;
  }

  protected renderDetail(data?: DataItem, options?: TooltipOptions) {
    const optionsIn = this.getOptions(options);
    return this.getDetail(data, optionsIn);
  }

  protected abstract getDetailList(
    hoverData: DataItem,
    options: TooltipOptions,
  ): ListItem[];

  protected abstract getSummaryProps(
    hoverData: DataItem,
    options: TooltipOptions,
  ): SummaryProps;

  // get non-null default options
  protected getOptions(options?: TooltipOptions) {
    return {
      actionType: '',
      operator: { onClick: _.noop, menus: [] },
      enterable: true,
      ...options,
    } as TooltipOptions;
  }

  /**
   * ToolTips container element
   */
  protected getContainer(options?: TooltipOptions): HTMLElement {
    if (!this.container) {
      // create a new div as container
      const container = document.createElement('div');
      document.body.appendChild(container);
      this.container = container;
    }
    // change class every time!
    this.container.className = this.getContainerClass(options);
    return this.container;
  }

  protected getContainerClass(options?: TooltipOptions) {
    console.debug(options);
    return CONTAINER_CLASS;
  }

  /**
   * Get top operation component
   * @param hoverData useless now
   * @param options tooltips option
   * @private
   */
  private getOperation(
    hoverData: DataItem,
    options: TooltipOptions,
  ): JSX.Element {
    const { operator } = options;
    if (operator) {
      const { onClick, menus } = operator;
      return <TooltipOperator onClick={onClick} menus={menus} />;
    }
    return null;
  }

  /**
   * Get summary component
   * @param hoverData
   * @param options
   * @private
   */
  private getSummary(
    hoverData: DataItem,
    options: TooltipOptions,
  ): JSX.Element {
    const props = this.getSummaryProps(hoverData, options);

    if (_.isEmpty(props)) {
      return null;
    }

    return <TooltipSummary {...props} />;
  }

  /**
   * Get detail component(list component)
   * @param hoverData
   * @param options
   * @private
   */
  private getDetail(hoverData: DataItem, options: TooltipOptions): JSX.Element {
    const detailList = this.getDetailList(hoverData, options);

    if (_.isEmpty(detailList)) {
      return null;
    }

    return <TooltipDetail list={detailList} />;
  }

  /**
   * Calculate tooltips's display position, to ensure display completely
   * @param position originPosition
   * @param viewportContainer
   */
  protected getPosition(
    position: Position,
    viewportContainer: HTMLElement = document.body,
  ): Position {
    const tooltipBCR = this.container.getBoundingClientRect();
    const viewportBCR = viewportContainer.getBoundingClientRect();
    let x = position.x + PositionXOffset;
    let y = position.y + PositionYOffset;

    if (x + tooltipBCR.width > viewportBCR.width) {
      x = viewportBCR.width - tooltipBCR.width - 2;
    }

    if (y + tooltipBCR.height > viewportBCR.height) {
      y = viewportBCR.height - tooltipBCR.height - 2;
    }

    return {
      x,
      y,
      tipHeight: tooltipBCR.height,
    };
  }

  private shouldIgnore(enterable, position: Position): boolean {
    if (this.enterable && enterable) {
      if (
        Math.abs(position.x - this.position.x) < 20 &&
        Math.abs(position.y - this.position.y) < 20
      ) {
        return true;
      }
    }
    return false;
  }
}
