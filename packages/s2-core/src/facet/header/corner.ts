import type { Group, Point } from '@antv/g-canvas';
import { includes, isEmpty } from 'lodash';
import { CornerCell } from '../../cell/corner-cell';
import { KEY_SERIES_NUMBER_NODE } from '../../common/constant';
import { i18n } from '../../common/i18n';
import type { S2CellType } from '../../common/interface';
import { CornerNodeType } from '../../common/interface/node';
import type { CornerBBox } from '../bbox/cornerBBox';
import type { PanelBBox } from '../bbox/panelBBox';
import { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import { getDefaultCornerText } from './../../common/constant/basic';
import { BaseHeader } from './base';
import type { BaseCornerOptions, CornerHeaderConfig } from './interface';

/**
 * Corner Header for SpreadSheet
 */
export class CornerHeader extends BaseHeader<CornerHeaderConfig> {
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
      facetCfg,
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
      facetCfg,
      layoutResult,
      seriesNumberWidth,
      spreadsheet,
    });
    return new CornerHeader({
      data: cornerNodes,
      position: { x: cornerBBox.x, y: cornerBBox.y },
      width: cornerWidth,
      height: cornerHeight,
      originalHeight: cornerOriginalHeight,
      originalWidth: cornerOriginalWidth,
      viewportWidth: width,
      viewportHeight: height,
      hierarchyType: facetCfg.hierarchyType, // 是否为树状布局
      hierarchyCollapse: facetCfg.hierarchyCollapse,
      rows: facetCfg.rows,
      columns: facetCfg.columns,
      seriesNumberWidth,
      spreadsheet,
    });
  }

  public static getTreeCornerText(options: BaseCornerOptions) {
    const { spreadsheet, facetCfg } = options;
    const { dataSet, rows } = facetCfg;

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
      .map((field): string => dataSet.getFieldName(field))
      .join('/');

    if (treeLabel) {
      return treeLabel;
    }

    return getDefaultCornerText();
  }

  public static getCornerNodes(
    options: BaseCornerOptions & {
      position: Point;
      width: number;
      height: number;
    },
  ): Node[] {
    const {
      position,
      width,
      facetCfg,
      layoutResult,
      seriesNumberWidth,
      spreadsheet,
    } = options;
    const { rowsHierarchy, colsHierarchy } = layoutResult;
    const { rows, columns, dataSet } = facetCfg;
    const cornerNodes: Node[] = [];
    const leafNode = colsHierarchy?.sampleNodeForLastLevel;
    // check if show series number node
    // spreadsheet must have at least one node in last level
    if (seriesNumberWidth && leafNode) {
      const sNode: Node = new Node({
        id: '',
        key: KEY_SERIES_NUMBER_NODE, // mark series node
        value: spreadsheet.options.seriesNumberText ?? i18n('序号'),
      });
      sNode.x = position?.x;
      // different type different y
      sNode.y = leafNode?.y;
      sNode.width = seriesNumberWidth;
      // different type different height
      sNode.height = leafNode?.height;
      sNode.isPivotMode = true;
      sNode.cornerType = CornerNodeType.Series;
      cornerNodes.push(sNode);
    }

    // spreadsheet type tree mode
    if (leafNode) {
      if (spreadsheet.isHierarchyTreeType()) {
        const cornerText = this.getTreeCornerText(options);
        const cornerNode: Node = new Node({
          key: '',
          id: '',
          value: cornerText,
        });
        cornerNode.x = position.x + seriesNumberWidth;
        cornerNode.y = colsHierarchy?.sampleNodeForLastLevel?.y;
        // cNode should subtract series width
        cornerNode.width = width - seriesNumberWidth;
        cornerNode.height = colsHierarchy?.sampleNodeForLastLevel?.height;
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
          // 自定义行头直接取采样的行头 key 值即可, 可通过 s2DataCfg.meta.name 自定义名称
          const field = isCustomRow
            ? rowNode.key
            : (rows[rowNode.level] as string);

          const value = dataSet.getFieldName(field);

          const cornerNode: Node = new Node({
            key: field,
            id: '',
            value,
          });

          cornerNode.x = rowNode.x + seriesNumberWidth;
          cornerNode.y = leafNode?.y;
          cornerNode.width = rowNode.width;
          cornerNode.height = leafNode?.height;
          cornerNode.field = field;
          cornerNode.isPivotMode = true;
          cornerNode.cornerType = CornerNodeType.Row;
          cornerNode.spreadsheet = spreadsheet;
          cornerNodes.push(cornerNode);
        });
      }
    }

    const columnNodes = colsHierarchy.sampleNodesForAllLevels || [];
    const isCustomColumn = spreadsheet.isCustomColumnFields();

    columnNodes.forEach((colNode) => {
      // 列头最后一个层级的位置为行头 label 标识，需要过滤
      if (colNode.level < colsHierarchy.maxLevel) {
        const field = isCustomColumn
          ? colNode.key
          : (columns[colNode.level] as string);
        const value = dataSet.getFieldName(field);

        const cNode = new Node({
          key: field,
          id: '',
          value,
        });
        cNode.x = position.x;
        cNode.y = colNode.y;
        cNode.width = width;
        cNode.height = colNode.height;
        cNode.field = field;
        cNode.isPivotMode = true;
        cNode.cornerType = CornerNodeType.Col;
        cNode.spreadsheet = spreadsheet;
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
}
