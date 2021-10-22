import { each, isEmpty } from 'lodash';
import { IGroup, IShape } from '@antv/g-base';
import { Group } from '@antv/g-canvas';
import { translateGroup } from '../utils';
import { BaseHeader, BaseHeaderConfig } from './base';
import {
  KEY_GROUP_COL_SCROLL,
  FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
  KEY_GROUP_COL_RESIZE_AREA,
  HORIZONTAL_RESIZE_AREA_KEY_PRE,
  CellTypes,
} from '@/common/constant';
import { ColCell } from '@/cell';
import { Formatter, S2CellType, ResizeInfo } from '@/common/interface';
import { Node } from '@/facet/layout/node';

import { SpreadSheet } from '@/sheet-type/index';

export interface ColHeaderConfig extends BaseHeaderConfig {
  // format field value
  formatter: (field: string) => Formatter;
  // corner width used when scroll {@link ColHeader#onColScroll}
  cornerWidth?: number;
  scrollContainsRowHeader?: boolean;
}

/**
 * Column Header for SpreadSheet
 */
export class ColHeader extends BaseHeader<ColHeaderConfig> {
  protected scrollGroup: IGroup;

  protected background: IShape;

  constructor(cfg: ColHeaderConfig) {
    super(cfg);

    this.scrollGroup = this.addGroup({
      name: KEY_GROUP_COL_SCROLL,
      zIndex: FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
    });
  }

  /**
   * Make colHeader scroll with hScrollBar
   * @param scrollX horizontal offset
   * @param cornerWidth only has real meaning when scroll contains rowCell
   * @param type
   */
  public onColScroll(scrollX: number, cornerWidth: number, type: string) {
    // this is works in scroll-keep-text-center feature
    if (this.headerConfig.scrollX !== scrollX) {
      this.headerConfig.offset = scrollX;
      this.headerConfig.scrollX = scrollX;
      this.headerConfig.cornerWidth = cornerWidth || 0;
      this.render(type);
    }
  }

  protected clip() {
    const { width, height, scrollX, spreadsheet } = this.headerConfig;

    const scrollXOffset = spreadsheet.isFreezeRowHeader() ? scrollX : 0;
    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: scrollXOffset,
        y: 0,
        width: width + scrollXOffset,
        height,
      },
    });
  }

  public clear() {
    this.background?.remove(true);
  }

  protected prevRendererColIds: string[] = [];

  protected getCellInstance(
    item: Node,
    spreadsheet: SpreadSheet,
    headerConfig: ColHeaderConfig,
  ) {
    return new ColCell(item, spreadsheet, headerConfig);
  }

  protected getCellGroup(node: Node) {
    return this.scrollGroup;
  }

  protected isColCellInRect(item: Node): boolean {
    const { spreadsheet, cornerWidth, width, scrollX } = this.headerConfig;

    return (
      // don't care about scrollY, because there is only freeze col-header exist
      width + scrollX > item.x &&
      scrollX - (spreadsheet.isFreezeRowHeader() ? 0 : cornerWidth) <
        item.x + item.width
    );
  }

  protected layout() {
    const { data, spreadsheet } = this.headerConfig;

    const colCell = spreadsheet?.facet?.cfg?.colCell;

    const rendererColIds = [];

    each(data, (node: Node) => {
      const item = node;
      const isColCellInRect = this.isColCellInRect(item);
      if (isColCellInRect) {
        rendererColIds.push(item);
      }
      const hasRender = this.prevRendererColIds.includes(item.id);

      if (isColCellInRect && !hasRender) {
        let cell: S2CellType;
        if (colCell) {
          cell = colCell(item, spreadsheet, this.headerConfig);
        }

        if (isEmpty(cell)) {
          cell = this.getCellInstance(item, spreadsheet, this.headerConfig);
        }
        item.belongsCell = cell;

        const group = this.getCellGroup(item);
        group.add(cell);
      } else if (!isColCellInRect && hasRender) {
        this.scrollGroup
          .getChildren()
          .filter((n: ColCell) => n.getMeta().id === item.id)[0]
          ?.remove(true);
      }
    });

    this.prevRendererColIds = rendererColIds.map((item) => item.id);
    this.drawResizeArea();
  }

  protected offset() {
    const { position, scrollX } = this.headerConfig;
    // 暂时不考虑移动y
    translateGroup(this.scrollGroup, position.x - scrollX, 0);
  }

  protected getColResizeAreaKey(meta: Node) {
    return meta.key;
  }

  protected getColResizeAreaOffset(meta: Node) {
    const { offset, position } = this.headerConfig;
    const { x, y } = meta;

    return {
      x: position.x - offset + x,
      y: position.y + y,
    };
  }

  protected getColResizeArea(meta: Node) {
    const { spreadsheet } = this.headerConfig;

    const prevResizeArea = spreadsheet?.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZE_AREA,
    );
    return (prevResizeArea ||
      spreadsheet?.foregroundGroup.addGroup({
        id: KEY_GROUP_COL_RESIZE_AREA,
      })) as Group;
  }

  protected getStyle(cellType: CellTypes) {
    const { spreadsheet } = this.headerConfig;
    return spreadsheet.theme[cellType];
  }

  protected drawResizeArea() {
    this.scrollGroup.getChildren().forEach((n: ColCell) => {
      this.drawResizeAreaForNode(n.getMeta());
    });
  }

  // 绘制单个节点的热区
  protected drawResizeAreaForNode(meta: Node) {
    const { spreadsheet, offset } = this.headerConfig;
    const { viewportWidth } = this.headerConfig;
    const { label, width: cellWidth, height: cellHeight, parent } = meta;
    const resizeStyle = spreadsheet?.theme?.resizeArea;
    const resizeArea = this.getColResizeArea(meta);
    const resizeAreaName = `${HORIZONTAL_RESIZE_AREA_KEY_PRE}${meta.key}`;

    const prevHorizontalResizeArea = resizeArea.find((element) => {
      return element.attrs.name === resizeAreaName;
    });
    const resizerOffset = this.getColResizeAreaOffset(meta);
    // 如果已经绘制当前列高调整热区热区，则不再绘制
    if (!prevHorizontalResizeArea) {
      // 列高调整热区
      resizeArea.addShape('rect', {
        attrs: {
          name: resizeAreaName,
          x: resizerOffset.x + offset,
          y: resizerOffset.y + cellHeight - resizeStyle.size / 2,
          width: viewportWidth,
          height: resizeStyle.size,
          fill: resizeStyle.background,
          fillOpacity: resizeStyle.backgroundOpacity,
          cursor: 'row-resize',
          appendInfo: {
            isResizeArea: true,
            class: 'resize-trigger',
            type: 'row',
            id: this.getColResizeAreaKey(meta),
            affect: 'field',
            offsetX: resizerOffset.x,
            offsetY: resizerOffset.y,
            width: viewportWidth,
            height: cellHeight,
          } as ResizeInfo,
        },
      });
    }
    if (meta.isLeaf) {
      // 列宽调整热区
      // 基准线是根据container坐标来的，因此把热区画在container
      resizeArea.addShape('rect', {
        attrs: {
          x: resizerOffset.x + cellWidth - resizeStyle.size / 2,
          y: resizerOffset.y,
          width: resizeStyle.size,
          height: cellHeight,
          fill: resizeStyle.background,
          fillOpacity: resizeStyle.backgroundOpacity,
          cursor: 'col-resize',
          appendInfo: {
            isResizeArea: true,
            class: 'resize-trigger',
            type: 'col',
            affect: 'cell',
            caption: parent.isTotals ? '' : label,
            offsetX: resizerOffset.x,
            offsetY: resizerOffset.y,
            width: cellWidth,
            height: cellHeight,
          } as ResizeInfo,
        },
      });
    }
  }
}
