import { get } from 'lodash';
import { TableColCell } from './table-col-cell';

export class TableCornerCell extends TableColCell {
  protected getStyle() {
    return get(this, 'theme.cornerCell');
  }
}
