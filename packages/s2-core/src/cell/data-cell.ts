import type { PointLike } from '@antv/g';
import {
  find,
  findLast,
  first,
  get,
  isEmpty,
  isEqual,
  isObject,
  isPlainObject,
  merge,
} from 'lodash';
import { BaseCell } from '../cell/base-cell';
import { G2_THEME_TYPE } from '../common';
import { EMPTY_PLACEHOLDER } from '../common/constant/basic';
import {
  CellType,
  InteractionStateName,
  SHAPE_STYLE_MAP,
} from '../common/constant/interaction';
import type {
  BaseChartData,
  CellMeta,
  Condition,
  ConditionMappingResult,
  FormatResult,
  MiniChartData,
  MultiData,
  TextTheme,
  ViewMeta,
  ViewMetaData,
  ViewMetaIndexType,
} from '../common/interface';
import {
  CellBorderPosition,
  CellClipBox,
  type HeaderActionNameOptions,
  type IconCondition,
  type InteractionStateTheme,
} from '../common/interface';
import { CellData } from '../data-set/cell-data';
import {
  getHorizontalTextIconPosition,
  getVerticalIconPosition,
  getVerticalTextPosition,
} from '../utils/cell/cell';
import {
  includeCell,
  shouldUpdateBySelectedCellsHighlight,
  updateBySelectedCellsHighlight,
} from '../utils/cell/data-cell';
import { groupIconsByPosition } from '../utils/cell/header-cell';
import { getIconPosition } from '../utils/condition/condition';
import { drawInterval } from '../utils/g-mini-charts';
import { updateShapeAttr } from '../utils/g-renders';
import type { RawData } from './../common/interface/s2DataConfig';

/**
 * DataCell for panelGroup area
 * ----------------------------
 * |                  |       |
 * |interval      text| icon  |
 * |                  |       |
 * ----------------------------
 * There are four conditions({@see BaseCell.conditions}) to determine how to render
 * 1、background color
 * 2、icon align in right with size {@link ICON_SIZE}
 * 3、left rect area is interval(in left) and text(in right)
 */
export class DataCell extends BaseCell<ViewMeta> {
  /**
   * 用于 merge cell 中用于绘制 border 的位置信息
   * @see packages/s2-core/src/facet/base-facet.ts L1319
   */
  position: [rowIndex: number, colIndex: number];

  // condition icon 坐标
  iconPosition: PointLike;

  public get cellType() {
    return CellType.DATA_CELL;
  }

  public isMultiData() {
    const fieldValue = this.getFieldValue();

    return isObject(fieldValue);
  }

  public isChartData() {
    const fieldValue = this.getFieldValue();

    return isPlainObject(
      (fieldValue as unknown as MultiData<MiniChartData>)?.values,
    );
  }

  public getRenderChartData(): BaseChartData {
    const { fieldValue } = this.meta;

    return (fieldValue as MultiData)?.values as BaseChartData;
  }

  public getRenderChartOptions() {
    const chartData = this.getRenderChartData();
    const cellArea = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const themeName = this.spreadsheet.getThemeName();

    return {
      autoFit: true,
      theme: { type: G2_THEME_TYPE[themeName] },
      ...cellArea,
      ...chartData,
    };
  }

  protected getBorderPositions(): CellBorderPosition[] {
    return [CellBorderPosition.BOTTOM, CellBorderPosition.RIGHT];
  }

  public get valueRangeByField() {
    return this.spreadsheet.dataSet.getValueRangeByField(this.meta.valueField);
  }

  protected handleByStateName(
    cells: CellMeta[],
    stateName: InteractionStateName,
  ) {
    if (includeCell(cells, this)) {
      this.updateByState(stateName);
    }
  }

  protected handleSearchResult(cells: CellMeta[]) {
    if (!includeCell(cells, this)) {
      return;
    }

    const targetCell = find(
      cells,
      (cell: CellMeta) => cell?.['isTarget'],
    ) as CellMeta;

    if (targetCell.id === this.getMeta().id) {
      this.updateByState(InteractionStateName.HIGHLIGHT);
    } else {
      this.updateByState(InteractionStateName.SEARCH_RESULT);
    }
  }

  protected handleSelect(cells: CellMeta[]) {
    const currentCellType = cells?.[0]?.type;

    switch (currentCellType) {
      // 列多选
      case CellType.COL_CELL:
        this.changeRowColSelectState('colIndex');
        break;
      // 行多选
      case CellType.ROW_CELL:
        this.changeRowColSelectState('rowIndex');
        break;
      // 单元格单选/多选
      case CellType.DATA_CELL:
        if (shouldUpdateBySelectedCellsHighlight(this.spreadsheet)) {
          updateBySelectedCellsHighlight(cells, this, this.spreadsheet);
        } else if (includeCell(cells, this)) {
          this.updateByState(InteractionStateName.SELECTED);
        } else if (
          this.spreadsheet.options.interaction?.selectedCellsSpotlight
        ) {
          this.updateByState(InteractionStateName.UNSELECTED);
        }

        break;
      default:
        break;
    }
  }

  protected isDisableHover(cellMeta: CellMeta) {
    return cellMeta.type !== CellType.DATA_CELL;
  }

  protected handleHover(cells: CellMeta[]) {
    const hoverCellMeta = first(cells) as CellMeta;

    if (this.isDisableHover(hoverCellMeta)) {
      this.hideInteractionShape();

      return;
    }

    const { currentRow, currentCol } =
      this.spreadsheet.interaction.getHoverHighlight();

    if (currentRow || currentCol) {
      // 如果当前是hover，要绘制出十字交叉的行列样式
      const currentColIndex = this.meta.colIndex;
      const currentRowIndex = this.meta.rowIndex;

      // 当视图内的 cell 行列 index 与 hover 的 cell 一致，绘制hover的十字样式
      if (
        (currentCol && currentColIndex === hoverCellMeta?.colIndex) ||
        (currentRow && currentRowIndex === hoverCellMeta?.rowIndex)
      ) {
        this.updateByState(InteractionStateName.HOVER);
      } else {
        // 当视图内的 cell 行列 index 与 hover 的 cell 不一致，隐藏其他样式
        this.hideInteractionShape();
      }
    }

    const { id, rowIndex, colIndex } = this.getMeta();

    // fix issue: https://github.com/antvis/S2/issues/1781
    if (
      isEqual(hoverCellMeta.id, id) &&
      isEqual(hoverCellMeta.rowIndex, rowIndex) &&
      isEqual(hoverCellMeta.colIndex, colIndex)
    ) {
      this.updateByState(InteractionStateName.HOVER_FOCUS);
    }
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    // 获取当前 interaction 记录的 Cells 元信息列表，不仅仅是数据单元格，也可能是行头或者列头。
    const cells = this.spreadsheet.interaction.getCells();

    if (stateName === InteractionStateName.ALL_SELECTED) {
      this.updateByState(InteractionStateName.SELECTED);

      return;
    }

    if (isEmpty(cells) || !stateName) {
      return;
    }

    switch (stateName) {
      case InteractionStateName.SELECTED:
      case InteractionStateName.DATA_CELL_BRUSH_SELECTED:
        this.handleSelect(cells);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(cells);
        break;
      case InteractionStateName.SEARCH_RESULT:
        this.handleSearchResult(cells);
        break;
      default:
        this.handleByStateName(cells, stateName);
        break;
    }
  }

  public setMeta(viewMeta: Partial<ViewMeta>) {
    super.setMeta(viewMeta as ViewMeta);
    this.initCell();
  }

  public drawTextShape() {
    super.drawTextShape();

    if (!this.isShallowRender()) {
      this.drawLinkField(this.meta);
    }
  }

  protected initCell() {
    this.resetTextAndConditionIconShapes();
    this.generateIconConfig();
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();

    if (!this.shouldHideRowSubtotalData()) {
      this.drawConditionIntervalShape();
    }

    if (!this.shouldHideRowSubtotalData()) {
      this.drawTextShape();
      this.drawConditionIconShapes();
    }

    this.drawBorders();
    this.drawInteractiveBorderShape();
    this.update();
  }

  protected generateIconConfig() {
    // data cell 只包含 condition icon
    // 并且为了保证格式的统一，只要有 condition icon 配置，就提供 icon 的占位，不过 mapping 结果是否为 null
    // 比如在 icon position 为 right 时，如果根据实际的 mappingResult 来决定是否提供 icon 占位，文字本身对齐效果就不太好，

    const iconCondition = this.findFieldCondition(
      this.conditions?.icon!,
    ) as IconCondition;

    const iconCfg =
      iconCondition &&
      iconCondition.mapping! &&
      ({
        // 此时 name 是什么值都无所谓，因为后面会根据 mappingResult 来决定
        name: '',
        position: getIconPosition(iconCondition),
      } as HeaderActionNameOptions);

    this.groupedIcons = groupIconsByPosition([], iconCfg);
  }

  protected getTextStyle(): TextTheme {
    const textOverflowStyle = this.getCellTextWordWrapStyle();
    const { isTotals } = this.meta;
    const { dataCell } = this.theme;
    const textStyle = isTotals ? dataCell?.bolderText : dataCell?.text;

    return this.getContainConditionMappingResultTextStyle({
      ...textOverflowStyle,
      ...textStyle,
    });
  }

  protected drawConditionIntervalShape() {
    this.conditionIntervalShape = drawInterval(this);
  }

  protected shouldHideRowSubtotalData() {
    const { rowId, rowIndex } = this.meta;
    // 如果该格子是被下钻的格子，下钻格子本身来说是明细格子，因为下钻变成了小计格子，是应该展示的
    const drillDownIdPathMap = this.spreadsheet.store.get('drillDownIdPathMap');

    if (drillDownIdPathMap?.has(rowId!)) {
      return false;
    }

    const { row = {} } = this.spreadsheet.options.totals ?? {};
    const node = this.spreadsheet.facet?.getRowLeafNodeByIndex(rowIndex);
    const isRowSubTotal = !node?.isGrandTotals && node?.isTotals;

    /**
     * 在树状结构时，如果单元格本身是行小计，但是行小计配置又未开启时
     * 不管能否查到实际的数据，都不应该展示
     */
    return (
      this.spreadsheet.isHierarchyTreeType() &&
      !row.showSubTotals &&
      isRowSubTotal
    );
  }

  protected getFormattedFieldValue(): FormatResult {
    if (this.shouldHideRowSubtotalData()) {
      return {
        value: null,

        /**
         * 这里使用默认的 placeholder，而不是空字符串，是为了防止后续使用用户自定义的 placeholder
         * 比如用户自定义 placeholder 为 0, 那行小计也会显示0，也很有迷惑性，显示 - 更为合理
         */
        formattedValue: EMPTY_PLACEHOLDER,
      };
    }

    const { rowId, valueField, fieldValue, data, id } = this.meta;
    const displayFormattedValue =
      this.spreadsheet.dataSet.displayFormattedValueMap?.get(id);
    const rowMeta = this.spreadsheet.dataSet.getFieldMeta(rowId!);
    const fieldId = rowMeta ? rowId : valueField;
    const formatter = this.spreadsheet.dataSet.getFieldFormatter(fieldId!);
    const formattedValue =
      displayFormattedValue ?? formatter(fieldValue, data, this.meta);

    return {
      value: fieldValue,
      formattedValue,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return width - this.getActionAndConditionIconWidth();
  }

  protected getTextPosition(): PointLike {
    const contentBox = this.getBBoxByType(CellClipBox.CONTENT_BOX);
    const textStyle = this.getTextStyle();
    const iconStyle = this.getIconStyle()!;

    const { textX, leftIconX, rightIconX } = getHorizontalTextIconPosition({
      bbox: contentBox,
      iconStyle,
      textWidth: this.getActualTextWidth(),
      textAlign: textStyle.textAlign!,
      groupedIcons: this.groupedIcons,
    });
    const y = getVerticalTextPosition(contentBox, textStyle.textBaseline!);
    const iconY = getVerticalIconPosition(
      iconStyle.size!,
      y,
      textStyle.fontSize!,
      textStyle.textBaseline!,
    );

    this.iconPosition = {
      x: !isEmpty(this.groupedIcons.left) ? leftIconX : rightIconX,
      y: iconY,
    };

    return {
      x: textX,
      y,
    };
  }

  protected getIconPosition() {
    return this.iconPosition;
  }

  public getBackgroundColor() {
    const backgroundColorByCross = this.getCrossBackgroundColor(
      this.meta.rowIndex,
    );
    const backgroundColor = backgroundColorByCross.backgroundColor;
    const backgroundColorOpacity =
      backgroundColorByCross.backgroundColorOpacity;

    if (this.shouldHideRowSubtotalData()) {
      return {
        backgroundColor,
        backgroundColorOpacity,
        intelligentReverseTextColor: false,
      };
    }

    return merge(
      { backgroundColor, backgroundColorOpacity },
      this.getBackgroundConditionFill(),
    );
  }

  // dataCell 根据 state 改变当前样式，
  protected changeRowColSelectState(indexType: ViewMetaIndexType) {
    const { interaction } = this.spreadsheet;
    const currentIndex = get(this.meta, indexType);
    const { nodes = [], cells = [] } = interaction.getState();
    let isEqualIndex = false;

    // 明细表模式多级表头计算索引换一种策略
    if (this.spreadsheet.isTableMode() && nodes.length) {
      const leafs = nodes[0].hierarchy.getLeaves();

      isEqualIndex = leafs.some((cell, i) => {
        if (nodes.some((node) => node === cell)) {
          return i === currentIndex;
        }

        return false;
      });
    } else {
      isEqualIndex = [...nodes, ...cells].some(
        (cell) => get(cell, indexType) === currentIndex,
      );
    }

    if (isEqualIndex) {
      this.updateByState(InteractionStateName.SELECTED);
    } else if (this.spreadsheet.options.interaction?.selectedCellsSpotlight) {
      this.updateByState(InteractionStateName.UNSELECTED);
    } else {
      this.hideInteractionShape();
    }
  }

  /**
   * 预留给明细表使用，透视表数据格不需要绘制 border， 已经交由 grid 处理
   */
  public override drawBorders(): void {}

  /**
   * Find current field related condition
   * @param conditions
   */
  public findFieldCondition<Con extends Condition>(
    conditions: Con[] = [],
  ): Con | undefined {
    return findLast(conditions, (item) =>
      item.field instanceof RegExp
        ? item.field.test(this.meta.valueField)
        : item.field === this.meta.valueField,
    );
  }

  /**
   * Mapping value to get condition related attrs
   * @param condition
   */

  public mappingValue<Result>(
    condition: Condition<Result>,
  ): ConditionMappingResult<Result> {
    const value = this.meta.fieldValue as unknown as number;
    const rowDataInfo = this.spreadsheet.isTableMode()
      ? this.spreadsheet.dataSet.getCellData({
          query: { rowIndex: this.meta.rowIndex },
        })
      : CellData.getFieldValue(this.meta.data as ViewMetaData);

    return condition.mapping(value, rowDataInfo as RawData, this);
  }

  public updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName, this);

    if (stateName === InteractionStateName.UNSELECTED) {
      const interactionStateTheme = get(
        this.theme,
        `${this.cellType}.cell.interactionState.${stateName}`,
      ) as unknown as InteractionStateTheme;

      if (interactionStateTheme) {
        this.toggleConditionIntervalShapeOpacity(
          interactionStateTheme.opacity!,
        );
      }
    }
  }

  public clearUnselectedState() {
    super.clearUnselectedState();
    this.toggleConditionIntervalShapeOpacity(1);
  }

  private toggleConditionIntervalShapeOpacity(opacity: number) {
    updateShapeAttr(
      this.conditionIntervalShape,
      SHAPE_STYLE_MAP.backgroundOpacity,
      opacity,
    );

    updateShapeAttr(this.conditionIconShapes, SHAPE_STYLE_MAP.opacity, opacity);
  }
}
