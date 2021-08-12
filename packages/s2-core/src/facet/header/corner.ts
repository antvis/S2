import { SimpleBBox, Group, Point } from '@antv/g-canvas';
import { get, last, includes, isEmpty } from 'lodash';
import { i18n } from '@/common/i18n';
import {
  KEY_SERIES_NUMBER_NODE,
  KEY_GROUP_CORNER_RESIZER,
  COLOR_DEFAULT_RESIZER,
} from '../../common/constant';
import { BaseDataSet } from '@/data-set';
import { SpreadSheet, Hierarchy, Node, CornerCell } from '../../index';
import {
  LayoutResult,
  S2Options,
  SpreadSheetFacetCfg,
} from '../../common/interface';
import { BaseHeader, BaseHeaderConfig, HIT_AREA } from './base';
import { CornerData, ResizeInfo } from './interface';
import { translateGroup } from '../utils';

export interface CornerHeaderConfig extends BaseHeaderConfig {
  // header's hierarchy type
  hierarchyType: S2Options['hierarchyType'];
  // the hierarchy collapse or not
  hierarchyCollapse: boolean;
  // column fields
  columns: string[];
  // series number width
  seriesNumberWidth: number;
}

/**
 * Corner Header for SpreadSheet
 */
export class CornerHeader extends BaseHeader<CornerHeaderConfig> {
  /**
   * Get corner Header by config
   * @param viewportBBox
   * @param cornerBBox
   * @param seriesNumberWidth
   * @param cfg
   * @param layoutResult
   * @param ss spreadsheet
   */
  public static getCornerHeader(
    viewportBBox: SimpleBBox,
    cornerBBox: SimpleBBox,
    seriesNumberWidth: number,
    cfg: SpreadSheetFacetCfg,
    layoutResult: LayoutResult,
    ss: SpreadSheet,
  ) {
    const { width, height } = viewportBBox;
    const cornerWidth = cornerBBox.width;
    const cornerHeight = cornerBBox.height;
    const cornerNodes: Node[] = this.getCornerNodes(
      { x: cornerBBox.x, y: cornerBBox.y },
      cornerWidth,
      cornerHeight,
      cfg.rows,
      layoutResult.rowsHierarchy,
      layoutResult.colsHierarchy,
      cfg.dataSet,
      seriesNumberWidth,
      ss,
    );

    return new CornerHeader({
      data: cornerNodes,
      position: { x: cornerBBox.x, y: cornerBBox.y },
      width: cornerWidth,
      height: cornerHeight,
      viewportWidth: width,
      viewportHeight: height,
      offset: 0,
      hierarchyType: cfg.hierarchyType, // 是否为树状布局
      hierarchyCollapse: cfg.hierarchyCollapse,
      columns: cfg.columns,
      seriesNumberWidth,
      spreadsheet: ss,
    });
  }

  public static getCornerNodes(
    position: Point,
    width: number,
    height: number,
    rows: string[],
    rowsHierarchy: Hierarchy,
    colsHierarchy: Hierarchy,
    dataSet: BaseDataSet,
    seriesNumberWidth: number,
    ss: SpreadSheet,
  ): Node[] {
    const cornerNodes: Node[] = [];

    const isPivotMode = ss.isPivotMode();
    // check if show series number node
    if (seriesNumberWidth) {
      // 1、spreadsheet must have at least one node in last level
      // 2、listSheet don't have other conditions
      if (
        (isPivotMode && colsHierarchy?.sampleNodeForLastLevel) ||
        !isPivotMode
      ) {
        const sNode: Node = new Node({
          key: KEY_SERIES_NUMBER_NODE, // mark series node
          id: '',
          value: i18n('序号'),
        });
        sNode.x = position?.x;
        // different type different y
        sNode.y = isPivotMode
          ? colsHierarchy?.sampleNodeForLastLevel?.y
          : position?.y;
        sNode.width = seriesNumberWidth;
        // different type different height
        sNode.height = isPivotMode
          ? colsHierarchy?.sampleNodeForLastLevel?.height
          : height;
        sNode.isPivotMode = isPivotMode;
        cornerNodes.push(sNode);
      }
    }

    // spreadsheet type tree mode
    if (isPivotMode && ss.isHierarchyTreeType()) {
      if (get(colsHierarchy, 'sampleNodeForLastLevel', undefined)) {
        const drillDownFieldInLevel = ss.store.get('drillDownFieldInLevel', []);
        const drillFields = drillDownFieldInLevel.map((d) => d.drillField);

        const cNode: Node = new Node({
          key: '',
          id: '',
          // 角头过滤下钻的维度
          value: rows
            .filter((value) => !includes(drillFields, value))
            .map((key: string): string => dataSet.getFieldName(key))
            .join('/'),
        });
        cNode.x = position.x + seriesNumberWidth;
        cNode.y = colsHierarchy?.sampleNodeForLastLevel?.y;
        cNode.width = width;
        cNode.height = colsHierarchy?.sampleNodeForLastLevel?.height;
        cNode.seriesNumberWidth = seriesNumberWidth;
        cNode.isPivotMode = isPivotMode;
        cornerNodes.push(cNode);
      }
    } else {
      // spreadsheet type
      // eslint-disable-next-line no-lonely-if
      if (
        isPivotMode &&
        get(colsHierarchy, 'sampleNodeForLastLevel', undefined)
      ) {
        rowsHierarchy.sampleNodesForAllLevels.forEach((rowNode) => {
          const field = rows[rowNode.level];
          const cNode: Node = new Node({
            key: field,
            id: '',
            value: dataSet.getFieldName(field),
          });
          cNode.x = rowNode.x + seriesNumberWidth;
          cNode.y = colsHierarchy.sampleNodeForLastLevel.y;
          cNode.width = rowNode.width;
          cNode.height = colsHierarchy.sampleNodeForLastLevel.height;
          cNode.field = field;
          cNode.isPivotMode = isPivotMode;
          cNode.spreadsheet = ss;
          cornerNodes.push(cNode);
        });
      } else {
        // detail type
        rowsHierarchy.sampleNodesForAllLevels.forEach((rowNode) => {
          const field = rows[rowNode.level];
          const cNode: Node = new Node({
            key: field,
            id: '',
            value: dataSet.getFieldName(field),
          });
          cNode.x = rowNode.x + seriesNumberWidth;
          cNode.y = position.y;
          cNode.width = rowNode.width;
          cNode.height = height;
          cNode.field = field;
          cNode.isPivotMode = isPivotMode;
          cNode.spreadsheet = ss;
          cornerNodes.push(cNode);
        });
      }
    }

    return cornerNodes;
  }

  constructor(cfg: CornerHeaderConfig) {
    super(cfg);
  }

  /**
   *  Make cornerHeader scroll with hScrollBar
   * @param scrollX
   */
  public onCorScroll(scrollX: number, type: string): void {
    this.headerConfig.scrollX = scrollX;
    this.render(type);
  }

  public destroy(): void {
    super.destroy();
  }

  protected layout() {
    this.startRender();
    this.handleHotsSpotArea();
  }

  protected startRender() {
    const { data, spreadsheet } = this.headerConfig;
    const cornerHeader = spreadsheet?.facet?.cfg?.cornerHeader;
    const cornerCell = spreadsheet?.facet?.cfg?.cornerCell;
    if (cornerHeader) {
      cornerHeader(this, spreadsheet, this.headerConfig);
      return;
    }
    // 背景
    this.addBgRect();
    data.forEach((item: Node) => {
      let cell: Group;
      if (cornerCell) {
        cell = cornerCell(
          item,
          this.headerConfig.spreadsheet,
          this.headerConfig,
        );
      }

      if (isEmpty(cell)) {
        cell = new CornerCell(
          item,
          this.headerConfig.spreadsheet,
          this.headerConfig,
        );
      }
      this.add(cell);
    });
  }

  protected offset() {
    const { scrollX } = this.headerConfig;
    translateGroup(this, -scrollX, 0);
  }

  protected clip(): void {
    const cfg = this.headerConfig;
    const { width, height, scrollX } = cfg;
    this.setClip({
      type: 'rect',
      attrs: {
        x: scrollX,
        y: 0,
        width,
        height,
      },
    });
  }

  protected addBgRect() {
    const cfg = this.headerConfig;
    const { width, height, position } = cfg;
    this.addShape('rect', {
      attrs: {
        x: position.x,
        y: position.y,
        width,
        height,
        fill: get(
          this.headerConfig,
          'spreadsheet.theme.cornerCell.cell.backgroundColor',
        ),
      },
    });
  }

  private handleHotsSpotArea() {
    const { data, position, width, height, seriesNumberWidth } =
      this.headerConfig;
    const prevResizer = this.headerConfig.spreadsheet.foregroundGroup.findById(
      KEY_GROUP_CORNER_RESIZER,
    );
    const resizer = (prevResizer ||
      this.headerConfig.spreadsheet.foregroundGroup.addGroup({
        id: KEY_GROUP_CORNER_RESIZER,
      })) as Group;
    const treeType = this.headerConfig.spreadsheet.isHierarchyTreeType();
    if (!treeType) {
      // do it in corner cell
    } else if (treeType) {
      resizer.addShape('rect', {
        attrs: {
          x: position.x + width - HIT_AREA / 2,
          y: position.y,
          width: HIT_AREA,
          height: this.get('viewportHeight') + height,
          fill: COLOR_DEFAULT_RESIZER,
          cursor: 'col-resize',
          appendInfo: {
            isResizer: true,
            class: 'resize-trigger',
            type: 'col',
            affect: 'tree',
            offsetX: position.x + seriesNumberWidth,
            offsetY: position.y,
            width: width - seriesNumberWidth,
            height,
          } as ResizeInfo,
        },
      });
    }
    const cell: CornerData = get(data, '0', {});
    resizer.addShape('rect', {
      attrs: {
        x: position.x,
        y: position.y + cell.y + cell.height - HIT_AREA / 2,
        width,
        height: HIT_AREA,
        fill: COLOR_DEFAULT_RESIZER,
        cursor: 'row-resize',
        appendInfo: {
          isResizer: true,
          class: 'resize-trigger',
          type: 'row',
          affect: 'field',
          id: last(this.get('columns')),
          offsetX: position.x,
          offsetY: position.y + cell.y,
          width: cell.width,
          height: cell.height,
        } as ResizeInfo,
      },
    });
  }
}
