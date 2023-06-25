import type { PointLike } from '@antv/g';
import { find, findLast, first, get, isEmpty, isEqual } from 'lodash';
import { BaseCell } from '../cell/base-cell';
import {
  CellTypes,
  InteractionStateName,
  SHAPE_STYLE_MAP,
} from '../common/constant/interaction';
import {
  CellBorderPosition,
  CellClipBox,
  type InteractionStateTheme,
} from '../common/interface';
import type {
  CellMeta,
  Condition,
  FormatResult,
  IconStyle,
  MappingResult,
  TextTheme,
  ViewMeta,
  ViewMetaIndexType,
} from '../common/interface';
import { getMaxTextWidth } from '../utils/cell/cell';
import {
  includeCell,
  shouldUpdateBySelectedCellsHighlight,
  updateBySelectedCellsHighlight,
} from '../utils/cell/data-cell';
import { getIconPositionCfg } from '../utils/condition/condition';
import { updateShapeAttr } from '../utils/g-renders';
import { EMPTY_PLACEHOLDER } from '../common/constant/basic';
import { drawInterval } from '../utils/g-mini-charts';
import {
  DEFAULT_FONT_COLOR,
  REVERSE_FONT_COLOR,
} from '../common/constant/condition';
import { shouldReverseFontColor } from '../utils/color';
import { getFieldValueOfViewMetaData } from '../data-set/cell-data';
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
  public get cellType() {
    return CellTypes.DATA_CELL;
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
      case CellTypes.COL_CELL:
        this.changeRowColSelectState('colIndex');
        break;
      // 行多选
      case CellTypes.ROW_CELL:
        this.changeRowColSelectState('rowIndex');
        break;
      // 单元格单选/多选
      case CellTypes.DATA_CELL:
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

  protected handleHover(cells: CellMeta[]) {
    const currentHoverCell = first(cells) as CellMeta;

    if (currentHoverCell.type !== CellTypes.DATA_CELL) {
      this.hideInteractionShape();

      return;
    }

    if (this.spreadsheet.options.interaction?.hoverHighlight) {
      // 如果当前是hover，要绘制出十字交叉的行列样式
      const currentColIndex = this.meta.colIndex;
      const currentRowIndex = this.meta.rowIndex;

      // 当视图内的 cell 行列 index 与 hover 的 cell 一致，绘制hover的十字样式
      if (
        currentColIndex === currentHoverCell?.colIndex ||
        currentRowIndex === currentHoverCell?.rowIndex
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
      isEqual(currentHoverCell.id, id) &&
      isEqual(currentHoverCell.rowIndex, rowIndex) &&
      isEqual(currentHoverCell.colIndex, colIndex)
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

  public setMeta(viewMeta: ViewMeta) {
    super.setMeta(viewMeta);
    this.initCell();
  }

  // draw text
  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkField(this.meta);
  }

  protected initCell() {
    this.resetTextAndConditionIconShapes();
    this.drawBackgroundShape();
    this.drawInteractiveBgShape();
    if (!this.shouldHideRowSubtotalData()) {
      this.drawConditionIntervalShape();
    }

    this.drawInteractiveBorderShape();

    if (!this.shouldHideRowSubtotalData()) {
      this.drawTextShape();
      this.drawConditionIconShapes();
    }

    this.drawBorders();
    this.update();
  }

  /**
   * 获取默认字体颜色：根据字段标记背景颜色，设置字体颜色
   * @param textStyle
   * @private
   */
  private getDefaultTextFill(textStyle: TextTheme) {
    let textFill = textStyle.fill;
    const { backgroundColor, intelligentReverseTextColor } =
      this.getBackgroundColor();

    // text 默认为黑色，当背景颜色亮度过低时，修改 text 为白色
    if (
      shouldReverseFontColor(backgroundColor as string) &&
      textStyle.fill === DEFAULT_FONT_COLOR &&
      intelligentReverseTextColor
    ) {
      textFill = REVERSE_FONT_COLOR;
    }

    return textFill;
  }

  protected getTextStyle(): TextTheme {
    const { isTotals } = this.meta;
    const textStyle = isTotals
      ? this.theme.dataCell?.bolderText
      : this.theme.dataCell?.text;

    // 优先级：默认字体颜色（已经根据背景反色后的） < 用户配置字体颜色
    const fill = this.getTextConditionFill({
      ...textStyle,
      fill: this.getDefaultTextFill(textStyle!),
    });

    return { ...textStyle, fill };
  }

  public getIconStyle(): IconStyle | undefined {
    const { size, margin } = this.theme.dataCell!.icon!;
    const iconCondition = this.findFieldCondition(this.conditions?.icon!);

    const iconCfg = iconCondition &&
      iconCondition.mapping! && {
        size,
        margin,
        position: getIconPositionCfg(iconCondition),
      };

    return iconCfg as IconStyle;
  }

  protected drawConditionIntervalShape() {
    this.conditionIntervalShape = drawInterval(this);
  }

  protected shouldHideRowSubtotalData() {
    const { row = {} } = this.spreadsheet.options.totals ?? {};
    const { rowIndex } = this.meta;
    const node = this.spreadsheet.facet.layoutResult.rowLeafNodes[rowIndex];
    const isRowSubTotal = !node?.isGrandTotals && node?.isTotals;

    /*
     * 在树状结构时，如果单元格本身是行小计，但是行小计配置又未开启时
     * 不过能否查到实际的数据，都不应该展示
     */
    return (
      this.spreadsheet.options.hierarchyType === 'tree' &&
      !row.showSubTotals &&
      isRowSubTotal
    );
  }

  protected getFormattedFieldValue(): FormatResult {
    if (this.shouldHideRowSubtotalData()) {
      return {
        value: null,

        /*
         * 这里使用默认的placeholder，而不是空字符串，是为了防止后续使用用户自定义的placeholder
         * 比如用户自定义 placeholder 为 0, 那行小计也会显示0，也很有迷惑性，显示 - 更为合理
         */
        formattedValue: EMPTY_PLACEHOLDER,
      };
    }

    const { rowId, valueField, fieldValue, data } = this.meta;
    const rowMeta = this.spreadsheet.dataSet.getFieldMeta(rowId!);
    const fieldId = rowMeta ? rowId : valueField;
    const formatter = this.spreadsheet.dataSet.getFieldFormatter(fieldId!);
    // TODO: 这里只用 formatter(fieldValue, this.meta) 即可, 为了保持兼容, 暂时在第三个参入传入 meta 信息
    const formattedValue = formatter(fieldValue, data, this.meta);

    return {
      value: fieldValue,
      formattedValue,
    };
  }

  protected getMaxTextWidth(): number {
    const { width } = this.getBBoxByType(CellClipBox.CONTENT_BOX);

    return getMaxTextWidth(width, this.getIconStyle());
  }

  protected getTextPosition(): PointLike {
    return this.getTextIconPosition().text;
  }

  public getBackgroundColor() {
    const cellStyle = this.getStyle()?.cell;
    const { crossBackgroundColor, backgroundColorOpacity } = cellStyle!;

    let backgroundColor = cellStyle!.backgroundColor;

    if (crossBackgroundColor && this.meta.rowIndex % 2 === 0) {
      /*
       * 隔行颜色的配置
       * 偶数行展示灰色背景，因为index是从0开始的
       */
      backgroundColor = crossBackgroundColor;
    }

    if (this.shouldHideRowSubtotalData()) {
      return { backgroundColor, backgroundColorOpacity };
    }

    // get background condition fill color
    const bgCondition = this.findFieldCondition(this.conditions?.background!);
    let intelligentReverseTextColor = false;

    if (bgCondition?.mapping!) {
      const attrs = this.mappingValue(bgCondition);

      if (attrs) {
        backgroundColor = attrs.fill;
        intelligentReverseTextColor = attrs.intelligentReverseTextColor!;
      }
    }

    return {
      backgroundColor,
      backgroundColorOpacity,
      intelligentReverseTextColor,
    };
  }

  // dataCell根据state 改变当前样式，
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
  public findFieldCondition(conditions: Condition[]): Condition | undefined {
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
  public mappingValue(condition: Condition): MappingResult | undefined | null {
    const value = this.meta.fieldValue as unknown as number;
    const rowDataInfo = this.spreadsheet.isTableMode()
      ? this.spreadsheet.dataSet.getCellData({
          query: { rowIndex: this.meta.rowIndex },
        })
      : getFieldValueOfViewMetaData(this.meta.data);

    return condition?.mapping(value, rowDataInfo as RawData, this);
  }

  public updateByState(stateName: InteractionStateName) {
    super.updateByState(stateName, this);

    if (stateName === InteractionStateName.UNSELECTED) {
      const interactionStateTheme = get(
        this.theme,
        `${this.cellType}.cell.interactionState.${stateName}`,
      ) as InteractionStateTheme;

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
