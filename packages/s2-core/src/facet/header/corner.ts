import { Group, Point, SimpleBBox } from '@antv/g-canvas';
import { get, includes, isEmpty, last, max } from 'lodash';
import { translateGroup } from '../utils';
import { BaseHeader, BaseHeaderConfig } from './base';
import { CornerData, ResizeInfo } from './interface';
import { CornerCell } from '@/cell/corner-cell';
import {
  KEY_GROUP_CORNER_RESIZE_AREA,
  KEY_SERIES_NUMBER_NODE,
} from '@/common/constant';
import { i18n } from '@/common/i18n';
import {
  LayoutResult,
  S2CellType,
  S2Options,
  SpreadSheetFacetCfg,
} from '@/common/interface';
import { BaseDataSet } from '@/data-set';
import { Hierarchy } from '@/facet/layout/hierarchy';
import { Node } from '@/facet/layout/node';
import { SpreadSheet } from '@/sheet-type';

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
      cfg.columns,
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
    columns: string[],
    rowsHierarchy: Hierarchy,
    colsHierarchy: Hierarchy,
    dataSet: BaseDataSet,
    seriesNumberWidth: number,
    ss: SpreadSheet,
  ): Node[] {
    const cornerNodes: Node[] = [];

    // 列头 label 横坐标偏移量：与行头 label 最右对齐
    let columOffsetX = 0;

    const isPivotMode = ss.isPivotMode();
    // check if show series number node
    if (seriesNumberWidth) {
      // 1、spreadsheet must have at least one node in last level
      if (isPivotMode && colsHierarchy?.sampleNodeForLastLevel) {
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
        sNode.cornerType = 'row';
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
        columOffsetX = max([cNode.x, columOffsetX]);
        cNode.y = colsHierarchy?.sampleNodeForLastLevel?.y;
        // cNode should subtract series width
        cNode.width = width - seriesNumberWidth;
        cNode.height = colsHierarchy?.sampleNodeForLastLevel?.height;
        cNode.seriesNumberWidth = seriesNumberWidth;
        cNode.isPivotMode = isPivotMode;
        cNode.cornerType = 'row';
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
          columOffsetX = max([cNode.x, columOffsetX]);
          cNode.y = colsHierarchy.sampleNodeForLastLevel.y;
          cNode.width = rowNode.width;
          cNode.height = colsHierarchy.sampleNodeForLastLevel.height;
          cNode.field = field;
          cNode.isPivotMode = isPivotMode;
          cNode.cornerType = 'row';
          cNode.spreadsheet = ss;
          cornerNodes.push(cNode);
        });
      }
    }
    colsHierarchy.sampleNodesForAllLevels.forEach((colNode) => {
      // 列头最后一个层级的位置为行头 label 标识，需要过滤
      if (colNode.level !== colsHierarchy.maxLevel) {
        const field = columns[colNode.level];
        const cNode: Node = new Node({
          key: field,
          id: '',
          value: dataSet.getFieldName(field),
        });
        cNode.x = columOffsetX;
        cNode.y = colNode.y;
        cNode.width = colsHierarchy.sampleNodeForLastLevel.width;
        cNode.height = colNode.height;
        cNode.field = field;
        cNode.isPivotMode = isPivotMode;
        cNode.cornerType = 'col';
        cNode.spreadsheet = ss;
        cornerNodes.push(cNode);
      }
    });
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
      cornerHeader(
        this as unknown as S2CellType,
        spreadsheet,
        this.headerConfig,
      );
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
    const resizeStyle = this.headerConfig.spreadsheet.theme.resizeArea;
    const prevResizeArea =
      this.headerConfig.spreadsheet.foregroundGroup.findById(
        KEY_GROUP_CORNER_RESIZE_AREA,
      );
    const resizeArea = (prevResizeArea ||
      this.headerConfig.spreadsheet.foregroundGroup.addGroup({
        id: KEY_GROUP_CORNER_RESIZE_AREA,
      })) as Group;
    const treeType = this.headerConfig.spreadsheet.isHierarchyTreeType();
    if (!treeType) {
      // do it in corner cell
    } else if (treeType) {
      resizeArea.addShape('rect', {
        attrs: {
          x: position.x + width - resizeStyle.size / 2,
          y: position.y,
          width: resizeStyle.size,
          height: this.get('viewportHeight') + height,
          fill: resizeStyle.background,
          fillOpacity: resizeStyle.backgroundOpacity,
          cursor: 'col-resize',
          appendInfo: {
            isResizeArea: true,
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
    resizeArea.addShape('rect', {
      attrs: {
        x: position.x,
        y: position.y + cell.y + cell.height - resizeStyle.size / 2,
        width,
        height: resizeStyle.size,
        fill: resizeStyle.background,
        fillOpacity: resizeStyle.backgroundOpacity,
        cursor: 'row-resize',
        appendInfo: {
          isResizeArea: true,
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
