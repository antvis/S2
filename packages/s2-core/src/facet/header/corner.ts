import { Group, Point } from '@antv/g-canvas';
import { get, includes, isEmpty } from 'lodash';
import { BaseHeader, BaseHeaderConfig } from './base';
import { PanelBBox } from '@/facet/bbox/panelBBox';
import { CornerBBox } from '@/facet/bbox/cornerBBox';
import { translateGroupX } from '@/facet/utils';
import { CornerCell } from '@/cell/corner-cell';
import { KEY_SERIES_NUMBER_NODE } from '@/common/constant';
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
  // rows fields
  rows: string[];
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
    panelBBox: PanelBBox,
    cornerBBox: CornerBBox,
    seriesNumberWidth: number,
    cfg: SpreadSheetFacetCfg,
    layoutResult: LayoutResult,
    s2: SpreadSheet,
  ) {
    const { width, height } = panelBBox;
    const {
      originalWidth: cornerOriginalWidth,
      originalHeight: cornerOriginalHeight,
      width: cornerWidth,
      height: cornerHeight,
    } = cornerBBox;

    const cornerNodes = this.getCornerNodes(
      { x: cornerBBox.x, y: cornerBBox.y },
      cornerOriginalWidth,
      cornerOriginalHeight,
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
      originalHeight: cornerOriginalHeight,
      originalWidth: cornerOriginalWidth,
      viewportWidth: width,
      viewportHeight: height,
      hierarchyType: cfg.hierarchyType, // 是否为树状布局
      hierarchyCollapse: cfg.hierarchyCollapse,
      rows: cfg.rows,
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
        id: '',
        key: KEY_SERIES_NUMBER_NODE, // mark series node
        value: i18n('序号'),
      });
      sNode.x = position?.x;
      // different type different y
      sNode.y = colsHierarchy?.sampleNodeForLastLevel?.y;
      sNode.width = seriesNumberWidth;
      // different type different height
      sNode.height = colsHierarchy?.sampleNodeForLastLevel?.height;
      sNode.isPivotMode = true;
      sNode.cornerType = CornerNodeType.Series;
      cornerNodes.push(sNode);
    }

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
        cNode.cornerType = CornerNodeType.Row;
        cornerNodes.push(cNode);
      } else {
        // spreadsheet type grid mode
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
          cNode.isPivotMode = true;
          cNode.cornerType = CornerNodeType.Row;
          cNode.spreadsheet = s2;
          cornerNodes.push(cNode);
        });
      }
    }

    colsHierarchy.sampleNodesForAllLevels.forEach((colNode) => {
      // 列头最后一个层级的位置为行头 label 标识，需要过滤
      if (colNode.level < colsHierarchy.maxLevel) {
        const field = columns[colNode.level];
        const cNode: Node = new Node({
          key: field,
          id: '',
          value: dataSet.getFieldName(field),
        });
        cNode.x = position.x;
        cNode.y = colNode.y;
        cNode.width = width;
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
    translateGroupX(this, -scrollX);
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
    const { originalWidth, originalHeight, position } = cfg;
    this.addShape('rect', {
      attrs: {
        x: position.x,
        y: position.y,
        width: originalWidth,
        height: originalHeight,
        fill: get(
          this.headerConfig,
          'spreadsheet.theme.cornerCell.cell.backgroundColor',
        ),
      },
    });
  }
}
