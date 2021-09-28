import { DataCell } from '@/cell/data-cell';

export class TableDataCell extends DataCell {
  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkFieldShape();
  }

  protected drawLinkFieldShape() {
    const { linkFields = [] } = this.spreadsheet.options;
    const linkTextFill = this.theme.rowCell.text.linkTextFill;

    super.drawLinkFieldShape(
      linkFields.includes(this.meta.valueField),
      linkTextFill,
    );
  }
}
