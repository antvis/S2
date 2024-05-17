import { Group, Rect } from '@antv/g';
import { each } from 'lodash';
import { TableColCell, TableCornerCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FrozenGroupArea,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_FROZEN_TRAILING,
  SERIES_NUMBER_FIELD,
} from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import type { FrozenFacet } from '../frozen-facet';
import { ColHeader } from './col';
import type { ColHeaderConfig } from './interface';
import { getExtraFrozenColNodes, getFrozenTrailingColOffset } from './util';

/**
 * Column Header for SpreadSheet
 */
export class TableColHeader extends ColHeader {
  public frozenGroup: Group;

  public frozenTrailingGroup: Group;

  private extraFrozenNodes: Node[];

  constructor(config: ColHeaderConfig) {
    super(config);
    this.initFrozenColGroups();
    this.extraFrozenNodes = getExtraFrozenColNodes(
      this.headerConfig.spreadsheet,
    );
  }

  protected getCellInstance(node: Node) {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { seriesNumberCell, colCell } = spreadsheet.options;

    const args: [Node, SpreadSheet, ColHeaderConfig] = [
      node,
      spreadsheet,
      headerConfig,
    ];

    if (node.field === SERIES_NUMBER_FIELD) {
      return seriesNumberCell?.(...args) || new TableCornerCell(...args);
    }

    return colCell?.(...args) || new TableColCell(...args);
  }

  private initFrozenColGroups() {
    this.frozenGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );

    this.frozenTrailingGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_FROZEN_TRAILING,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
  }

  public clear() {
    super.clear();

    this.frozenTrailingGroup?.removeChildren();
    this.frozenGroup?.removeChildren();
  }

  protected getCellGroup(node: Node): Group {
    if (node.isFrozenHead) {
      return this.frozenGroup;
    }

    if (node.isFrozenTrailing) {
      return this.frozenTrailingGroup;
    }

    return this.scrollGroup;
  }

  protected layout() {
    super.layout();
    each(this.extraFrozenNodes, (node) => {
      this.appendNode(node);
    });
  }

  protected override offset() {
    super.offset();

    const { position, spreadsheet, viewportWidth } = this.getHeaderConfig();
    const frozenGroupAreas = (spreadsheet.facet as FrozenFacet)
      .frozenGroupAreas;

    const trailingColOffset = getFrozenTrailingColOffset(
      frozenGroupAreas,
      viewportWidth,
    );

    translateGroupX(this.frozenGroup, position.x);
    translateGroupX(this.frozenTrailingGroup, position.x - trailingColOffset);
  }

  protected clip(): void {
    super.clip();

    const { height, viewportWidth, position, spreadsheet } =
      this.getHeaderConfig();

    const frozenGroupAreas = (spreadsheet.facet as FrozenFacet)
      .frozenGroupAreas;

    const frozenColGroupWidth = frozenGroupAreas[FrozenGroupArea.Col].width;
    const frozenTrailingColGroupWidth =
      frozenGroupAreas[FrozenGroupArea.TrailingCol].width;

    this.frozenGroup.style.clipPath = new Rect({
      style: {
        x: position.x,
        y: position.y,
        width: frozenColGroupWidth,
        height,
      },
    });

    this.frozenTrailingGroup.style.clipPath = new Rect({
      style: {
        x: position.x + viewportWidth - frozenTrailingColGroupWidth,
        y: position.y,
        width: frozenTrailingColGroupWidth,
        height,
      },
    });
  }
}
