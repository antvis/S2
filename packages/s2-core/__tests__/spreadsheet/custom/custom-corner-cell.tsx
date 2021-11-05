import { CornerCell } from '@/cell';

export class CustomCornelCell extends CornerCell {
  drawCellText() {
    if (this.meta.cornerType === 'col') {
      return;
    }
    super.drawCellText();
  }
}
