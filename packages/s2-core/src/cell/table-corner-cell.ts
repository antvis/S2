import { get } from 'lodash';
import { TableColCell } from './table-col-cell';

export class TableCornerCell extends TableColCell {
  public getStyle(name?: string) {
    return name ? get(this.theme, name) : this.theme?.cornerCell;
  }

  protected showSortIcon() {
    return false;
  }
}
