import { Rect, type PointLike } from '@antv/g';
import { includes } from 'lodash';
import { CornerCell } from '../../cell/corner-cell';
import type { S2CellType } from '../../common/interface';
import { CornerNodeType } from '../../common/interface/node';
import type { CornerBBox } from '../bbox/corner-bbox';
import type { PanelBBox } from '../bbox/panel-bbox';
import { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import { S2Event } from '../../common';
import {
  getDefaultCornerText,
  getDefaultSeriesNumberText,
} from './../../common/constant/basic';
import { BaseHeader } from './base';
import type { BaseCornerOptions, CornerHeaderConfig } from './interface';

/**
 * Corner Header for SpreadSheet
 */
export class CornerHeader extends BaseHeader<CornerHeaderConfig> {
  constructor(config: CornerHeaderConfig) {
    super(config);
  }

  protected getCellInstance(node: Node): CornerCell {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { cornerCell } = spreadsheet.options;

    return (
      cornerCell?.(node, spreadsheet, headerConfig) ||
      new CornerCell(node, spreadsheet, headerConfig)
    );
  }

  /**
   * Get corner Header by config
   */
  public static getCornerHeader(
    options: BaseCornerOptions & {
      panelBBox: PanelBBox;
      cornerBBox: CornerBBox;
    },
  ) {
    const {
      panelBBox,
      cornerBBox,
      seriesNumberWidth,
      layoutResult,
      spreadsheet,
    } = options;
    const { width, height } = panelBBox;
    const {
      originalWidth: cornerOriginalWidth,
      originalHeight: cornerOriginalHeight,
      width: cornerWidth,
      height: cornerHeight,
    } = cornerBBox;

    const cornerNodes = this.getCornerNodes({
      position: {
        x: cornerBBox.x,
        y: cornerBBox.y,
      },
      width: cornerOriginalWidth,
      height: cornerOriginalHeight,
      layoutResult,
      seriesNumberWidth,
      spreadsheet,
    });

    return new CornerHeader({
      nodes: cornerNodes,
      position: { x: cornerBBox.x, y: cornerBBox.y },
      width: cornerWidth,
      height: cornerHeight,
      originalHeight: cornerOriginalHeight,
      originalWidth: cornerOriginalWidth,
      viewportWidth: width,
      viewportHeight: height,
      seriesNumberWidth,
      spreadsheet,
    });
  }

  public static getTreeCornerText(options: BaseCornerOptions) {
    const { spreadsheet } = options;
    const { rows = [] } = spreadsheet.dataSet.fields;

    const { cornerText: defaultCornerText } = spreadsheet.options;

    if (defaultCornerText) {
      return defaultCornerText;
    }

    const drillDownFieldInLevel = spreadsheet.store.get(
      'drillDownFieldInLevel',
      [],
    );
    const drillFields = drillDownFieldInLevel.map((field) => field.drillField);

    // 角头过滤下钻的维度
    const treeLabel = rows
      .filter((value) => !includes(drillFields, value))
      .map((field): string => spreadsheet.dataSet.getFieldName(field))
      .join('/');

    if (treeLabel) {
      return treeLabel;
    }

    return getDefaultCornerText();
  }

  public static getCornerNodes(
    options: BaseCornerOptions & {
      position: PointLike;
      width: number;
      height: number;
    },
  ): Node[] {
    const { position, width, layoutResult, seriesNumberWidth, spreadsheet } =
      options;
    const { rowsHierarchy, colsHierarchy } = layoutResult;
    const { rows = [], columns = [] } = spreadsheet?.dataSet?.fields || {};
    const { colCell } = spreadsheet.options.style!;
    const cornerNodes: Node[] = [];
    const leafNode = colsHierarchy?.sampleNodeForLastLevel;

    if (seriesNumberWidth) {
      const sNode: Node = new Node({
        id: '',
        field: '',
        value: getDefaultSeriesNumberText(
          spreadsheet.options.seriesNumber?.text,
        ),
      });

      sNode.x = position?.x;
      // different type different y
      sNode.y = leafNode?.y ?? 0;
      sNode.width = seriesNumberWidth;
      // different type different height
      sNode.height = leafNode?.height! ?? (colCell?.height as number);
      sNode.isPivotMode = true;
      sNode.spreadsheet = spreadsheet;
      sNode.cornerType = CornerNodeType.Series;
      cornerNodes.push(sNode);
    }

    if (spreadsheet.isHierarchyTreeType()) {
      const cornerText = this.getTreeCornerText(options);
      const cornerNode: Node = new Node({
        id: cornerText,
        field: '',
        value: cornerText,
      });

      cornerNode.x = position.x + seriesNumberWidth;
      cornerNode.y = leafNode?.y! ?? 0;
      // cNode should subtract series width
      cornerNode.width = width - seriesNumberWidth;
      cornerNode.height = leafNode?.height! ?? (colCell?.height as number);
      cornerNode.seriesNumberWidth = seriesNumberWidth;
      cornerNode.isPivotMode = true;
      cornerNode.spreadsheet = spreadsheet;
      cornerNode.cornerType = CornerNodeType.Row;
      cornerNodes.push(cornerNode);
    } else {
      const rowNodes = rowsHierarchy.sampleNodesForAllLevels || [];
      const isCustomRow = spreadsheet.isCustomRowFields();

      // spreadsheet type grid mode
      rowNodes.forEach((rowNode) => {
        // 自定义行头直接取采样的行头 field 值即可, 可通过 s2DataCfg.meta.name 自定义名称
        const field = isCustomRow
          ? rowNode.field
          : (rows[rowNode.level] as string);

        const value = spreadsheet.dataSet.getFieldName(field);
        const cornerNode: Node = new Node({
          id: field,
          field,
          value,
        });

        cornerNode.x = rowNode.x + seriesNumberWidth;
        cornerNode.y = leafNode?.y ?? 0;
        cornerNode.width = rowNode.width;
        cornerNode.height = leafNode?.height! ?? (colCell?.height as number);
        cornerNode.isPivotMode = true;
        cornerNode.cornerType = CornerNodeType.Row;
        cornerNode.spreadsheet = spreadsheet;
        cornerNodes.push(cornerNode);
      });
    }

    const columnNodes = colsHierarchy.sampleNodesForAllLevels || [];
    const isCustomColumn = spreadsheet.isCustomColumnFields();

    columnNodes.forEach((colNode) => {
      // 列头最后一个层级的位置为行头 label 标识，需要过滤
      if (colNode.level < colsHierarchy.maxLevel) {
        const field = isCustomColumn
          ? colNode.field
          : (columns[colNode.level] as string);
        const value = spreadsheet.dataSet.getFieldName(field);

        const cNode = new Node({
          id: field,
          field,
          value,
        });

        cNode.x = position.x;
        cNode.y = colNode.y;
        cNode.width = width;
        cNode.height = colNode.height;
        cNode.isPivotMode = true;
        cNode.cornerType = CornerNodeType.Col;
        cNode.spreadsheet = spreadsheet;
        cornerNodes.push(cNode);
      }
    });

    return cornerNodes;
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
    const { nodes, spreadsheet } = this.getHeaderConfig();
    const cornerHeader = spreadsheet.options?.cornerHeader;

    if (cornerHeader) {
      cornerHeader(
        this as unknown as S2CellType,
        spreadsheet,
        this.headerConfig,
      );

      return;
    }

    nodes.forEach((node) => {
      const cell = this.getCellInstance(node);

      this.appendChild(cell);
      spreadsheet.emit(S2Event.CORNER_CELL_RENDER, cell);
      spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
    });
  }

  protected offset() {
    const { scrollX = 0 } = this.getHeaderConfig();

    translateGroupX(this, -scrollX);
  }

  protected clip(): void {
    const { width, height } = this.getHeaderConfig();

    this.style.clipPath = new Rect({
      style: {
        x: 0,
        y: 0,
        width,
        height,
      },
    });
  }

  public getNodes(): Node[] {
    return this.headerConfig.nodes || [];
  }
}
