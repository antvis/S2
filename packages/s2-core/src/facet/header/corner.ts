import type { Group, Point } from '@antv/g-canvas';
import { includes, isEmpty } from 'lodash';
import { CornerCell } from '../../cell/corner-cell';
import { KEY_SERIES_NUMBER_NODE } from '../../common/constant';
import { i18n } from '../../common/i18n';
import type {
  LayoutResult,
  S2CellType,
  S2Options,
  SpreadSheetFacetCfg,
} from '../../common/interface';
import { CornerNodeType } from '../../common/interface/node';
import type { BaseDataSet } from '../../data-set';
import type { SpreadSheet } from '../../sheet-type';
import type { CornerBBox } from '../bbox/cornerBBox';
import type { PanelBBox } from '../bbox/panelBBox';
import type { Hierarchy } from '../layout/hierarchy';
import { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import { BaseHeader, type BaseHeaderConfig } from './base';

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
      cfg.columns as string[],
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
      columns: cfg.columns as string[],
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
    const { colCfg } = s2.options.style;
    const leafNode = colsHierarchy?.sampleNodeForLastLevel;
    const cornerNodeY = leafNode?.y ?? 0;
    const cornerNodeHeight = leafNode?.height ?? colCfg?.height ?? 0;

    // check if show series number node
    if (seriesNumberWidth) {
      const sNode: Node = new Node({
        id: '',
        key: KEY_SERIES_NUMBER_NODE, // mark series node
        value: i18n('序号'),
      });
      sNode.x = position?.x;
      // different type different y
      sNode.y = cornerNodeY;
      sNode.width = seriesNumberWidth;
      // different type different height
      sNode.height = cornerNodeHeight;
      sNode.isPivotMode = true;
      sNode.spreadsheet = s2;
      sNode.cornerType = CornerNodeType.Series;
      cornerNodes.push(sNode);
    }

    // spreadsheet type tree mode
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
      cNode.y = cornerNodeY;
      // cNode should subtract series width
      cNode.width = width - seriesNumberWidth;
      cNode.height = cornerNodeHeight;
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
        cNode.y = cornerNodeY;
        cNode.width = rowNode.width;
        cNode.height = cornerNodeHeight;
        cNode.field = field;
        cNode.isPivotMode = true;
        cNode.cornerType = CornerNodeType.Row;
        cNode.spreadsheet = s2;
        cornerNodes.push(cNode);
      });
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

    data.forEach((node: Node) => {
      let cell: Group;
      if (cornerCell) {
        cell = cornerCell(
          node,
          this.headerConfig.spreadsheet,
          this.headerConfig,
        );
      }

      if (isEmpty(cell)) {
        cell = new CornerCell(
          node,
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

  public getNodes(): Node[] {
    return this.headerConfig.data || [];
  }
}
