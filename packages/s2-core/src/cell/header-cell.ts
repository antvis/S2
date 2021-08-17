import { BaseHeaderConfig } from '@/facet/header/base';
import { find } from 'lodash';
import { BaseCell } from 'src/cell';
import { Node, SpreadSheet } from '../index';

export abstract class HeaderCell extends BaseCell<Node> {
  protected headerConfig: BaseHeaderConfig;

  constructor(
    meta: Node,
    spreadsheet: SpreadSheet,
    headerConfig: BaseHeaderConfig,
  ) {
    super(meta, spreadsheet, headerConfig);
  }

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = headerConfig;
  }

  public update() {
    const selectedId = this.spreadsheet.store.get('rowColSelectedId');
    if (selectedId && find(selectedId, (id) => id === this.meta.id)) {
      this.setActive();
    } else {
      this.setInactive();
    }
  }

  /**
   * @description set active style, should be implemented by subtype
   */
  public setActive() {}

  /**
   * @description set inactive style, should be implemented by subtype
   */
  public setInactive() {}
}
