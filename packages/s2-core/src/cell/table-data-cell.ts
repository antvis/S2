import { DataCell } from 'src/cell/data-cell';

export class TableDataCell extends DataCell {
  protected drawTextShape() {
    super.drawTextShape();
    this.drawLinkFieldShape();
  }

  protected drawLinkFieldShape() {
    const { linkFieldIds = [] } = this.spreadsheet.options;
    const linkTextFill = this.theme.rowCell.text.linkTextFill;

    super.drawLinkFieldShape(
      linkFieldIds.includes(this.meta.valueField),
      linkTextFill,
    );
  }
}
