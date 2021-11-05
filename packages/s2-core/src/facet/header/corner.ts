import { Group, Point, SimpleBBox } from '@antv/g-canvas';
import { get, includes, isEmpty, last } from 'lodash';
import { BaseHeader, BaseHeaderConfig } from './base';
import { CornerData } from './interface';
import { translateGroup } from '@/facet/utils';
import {
  getResizeAreaAttrs,
  getOrCreateResizeAreaGroupById,
} from '@/utils/interaction/resize';
import { CornerCell } from '@/cell/corner-cell';
import {
  KEY_GROUP_CORNER_RESIZE_AREA,
  KEY_SERIES_NUMBER_NODE,
  ResizeAreaEffect,
  ResizeAreaType,
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
import { CornerNodeType } from '@/common/interface/node';

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
   * @param panelBBox
   * @param cornerBBox
   * @param seriesNumberWidth
   * @param cfg
   * @param layoutResult
   * @param s2 spreadsheet
   */
  public static getCornerHeader(
    panelBBox: SimpleBBox,
    cornerBBox: SimpleBBox,
    seriesNumberWidth: number,
    cfg: SpreadSheetFacetCfg,
    layoutResult: LayoutResult,
    s2: SpreadSheet,
  ) {
    const { width, height } = panelBBox;
    const cornerWidth = cornerBBox.width;
    const cornerHeight = cornerBBox.height;
    const cornerNodes = this.getCornerNodes(
      { x: cornerBBox.x, y: cornerBBox.y },
      cornerWidth,
      cornerHeight,
      cfg.rows,
      cfg.columns,
      layoutResult.rowsHierarchy,
      layoutResult.colsHierarchy,
      cfg.dataSet,
      seriesNumberWidth,
      s2,
    );
    return new CornerHeader({
      data: cornerNodes,
      position: { x: cornerBBox.x, y: cornerBBox.y },
      width: cornerWidth,
      height: cornerHeight,
      viewportWidth: width,
      viewportHeight: height,
      hierarchyType: cfg.hierarchyType, // 是否为树状布局
      hierarchyCollapse: cfg.hierarchyCollapse,
      columns: cfg.columns,
      seriesNumberWidth,
      spreadsheet: s2,
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
    s2: SpreadSheet,
  ): Node[] {
    const cornerNodes: Node[] = [];
    // check if show series number node
    // spreadsheet must have at least one node in last level
    if (seriesNumberWidth && colsHierarchy?.sampleNodeForLastLevel) {
      const sNode: Node = new Node({
        key: KEY_SERIES_NUMBER_NODE, // mark series node
        id: '',
        value: i18n('序号'),
      });
      sNode.x = position?.x;
      // different type different y
      sNode.y = colsHierarchy?.sampleNodeForLastLevel?.y;
      sNode.width = seriesNumberWidth;
      // different type different height
      sNode.height = colsHierarchy?.sampleNodeForLastLevel?.height;
      sNode.isPivotMode = true;
      sNode.cornerType = CornerNodeType.ROW;
      cornerNodes.push(sNode);
    }

    // 列头 label 横坐标偏移量：与行头 label 最右对齐
    let columOffsetX = seriesNumberWidth;
    // spreadsheet type tree mode
    if (colsHierarchy?.sampleNodeForLastLevel) {
      if (s2.isHierarchyTreeType()) {
        const drillDownFieldInLevel = s2.store.get('drillDownFieldInLevel', []);
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
        // cNode should subtract series width
        cNode.width = width - seriesNumberWidth;
        cNode.height = colsHierarchy?.sampleNodeForLastLevel?.height;
        cNode.seriesNumberWidth = seriesNumberWidth;
        cNode.isPivotMode = true;
        cNode.spreadsheet = s2;
        cNode.cornerType = CornerNodeType.ROW;
        cornerNodes.push(cNode);
      } else {
        // spreadsheet type grid mode
        rowsHierarchy.sampleNodesForAllLevels.forEach((rowNode) => {
          // 避免因为小计总计格子宽度调整出现的错位
          const field = rows[rowNode.level];
          const cNode: Node = new Node({
            key: field,
            id: '',
            value: dataSet.getFieldName(field),
          });

          cNode.x = columOffsetX;
          cNode.y = colsHierarchy.sampleNodeForLastLevel.y;
          cNode.width = rowNode.width;
          cNode.height = colsHierarchy.sampleNodeForLastLevel.height;
          cNode.field = field;
          cNode.isPivotMode = true;
          cNode.cornerType = CornerNodeType.ROW;
          cNode.spreadsheet = s2;
          cornerNodes.push(cNode);

          if (rowNode.level < rowsHierarchy.maxLevel) {
            columOffsetX += cNode.width;
          }
        });
      }
    }

    colsHierarchy.sampleNodesForAllLevels.forEach((colNode) => {
      // 列头最后一个层级的位置为行头 label 标识，需要过滤
      if (colNode.level < colsHierarchy.maxLevel) {
        const freezeCornerDiffWidth = s2.facet.getFreezeCornerDiffWidth();
        const field = columns[colNode.level];
        const cNode: Node = new Node({
          key: field,
          id: '',
          value: dataSet.getFieldName(field),
        });
        cNode.x = columOffsetX;
        cNode.y = colNode.y;
        cNode.width = width - columOffsetX + freezeCornerDiffWidth;
        cNode.height = colNode.height;
        cNode.field = field;
        cNode.isPivotMode = true;
        cNode.cornerType = CornerNodeType.Col;
        cNode.spreadsheet = s2;
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
    this.renderCells();
    this.renderResizeAreas();
  }

  protected renderCells() {
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
    const { width, height, scrollX } = this.headerConfig;
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

  private renderResizeAreas() {
    const { data, position, width, height, seriesNumberWidth, spreadsheet } =
      this.headerConfig;
    const resizeStyle = spreadsheet.theme.resizeArea;
    const resizeArea = getOrCreateResizeAreaGroupById(
      spreadsheet,
      KEY_GROUP_CORNER_RESIZE_AREA,
    );

    if (spreadsheet.isHierarchyTreeType()) {
      resizeArea.addShape('rect', {
        attrs: {
          ...getResizeAreaAttrs({
            theme: resizeStyle,
            type: ResizeAreaType.Col,
            effect: ResizeAreaEffect.Tree,
            offsetX: position.x + seriesNumberWidth,
            offsetY: position.y,
            width: width - seriesNumberWidth,
            height,
          }),
          x: position.x + width - resizeStyle.size / 2,
          y: position.y,
          height: this.get('viewportHeight') + height,
        },
      });
    }
    const cell: CornerData = get(data, '0', {});
    const offsetX = position.x;
    const offsetY = position.y;

    resizeArea.addShape('rect', {
      attrs: {
        ...getResizeAreaAttrs({
          theme: resizeStyle,
          type: ResizeAreaType.Row,
          effect: ResizeAreaEffect.Filed,
          id: last(this.get('columns')),
          offsetX,
          offsetY,
          width: cell.width,
          height: cell.height,
        }),
        x: offsetX,
        y: offsetY + cell.y + cell.height - resizeStyle.size / 2,
        width,
      },
    });
  }
}
