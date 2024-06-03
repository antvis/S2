import { Group } from '@antv/g';
import { SeriesNumberCell } from '../../cell/series-number-cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  KEY_GROUP_ROW_INDEX_FROZEN,
  KEY_GROUP_ROW_INDEX_FROZEN_TRAILING,
  KEY_GROUP_ROW_INDEX_SCROLL,
  S2Event,
} from '../../common';
import type { SpreadSheet } from '../../sheet-type/index';
import type { PanelBBox } from '../bbox/panel-bbox';
import type { FrozenFacet } from '../frozen-facet';
import type { Hierarchy } from '../layout/hierarchy';
import type { Node } from '../layout/node';
import { RowHeader } from './row';
import { getExtraFrozenSeriesNodes, getSeriesNumberNodes } from './util';

export class SeriesNumberHeader extends RowHeader {
  /**
   * Get seriesNumber header by config
   */
  public static getSeriesNumberHeader(options: {
    panelBBox: PanelBBox;
    seriesNumberWidth: number;
    rowsHierarchy: Hierarchy;
    spreadsheet: SpreadSheet;
    cornerWidth: number;
  }): SeriesNumberHeader {
    const {
      panelBBox,
      seriesNumberWidth,
      rowsHierarchy,
      spreadsheet,
      cornerWidth,
    } = options;
    const { height, viewportHeight } = panelBBox;

    const layoutSeriesNumberNodes =
      spreadsheet.options?.layoutSeriesNumberNodes ?? getSeriesNumberNodes;

    return new SeriesNumberHeader({
      width: cornerWidth,
      height,
      viewportWidth: cornerWidth,
      viewportHeight,
      position: { x: 0, y: panelBBox.y },
      nodes: layoutSeriesNumberNodes(
        rowsHierarchy,
        seriesNumberWidth,
        spreadsheet,
      ),
      spreadsheet,
    });
  }

  protected initGroups(): void {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_INDEX_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
      }),
    );

    this.frozenGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_INDEX_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
    this.frozenTrailingGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_INDEX_FROZEN_TRAILING,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );

    const { spreadsheet, nodes } = this.getHeaderConfig();

    this.extraFrozenNodes = getExtraFrozenSeriesNodes(
      spreadsheet.facet as FrozenFacet,
      nodes,
    );
  }

  getCellInstance(node: Node) {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { seriesNumberCell } = spreadsheet.options;

    return (
      seriesNumberCell?.(node, spreadsheet, headerConfig) ||
      new SeriesNumberCell(node, spreadsheet, headerConfig)
    );
  }

  protected emitRenderEvent(cell: SeriesNumberCell): void {
    const { spreadsheet } = this.getHeaderConfig();

    spreadsheet.emit(S2Event.SERIES_NUMBER_CELL_RENDER, cell);
    spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
  }
}
