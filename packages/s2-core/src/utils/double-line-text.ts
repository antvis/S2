import { getEllipsisText } from '../utils/text';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
export default function doubleLineText(
  content: string,
  maxWidth: number,
): string {
  let drawText = '';
  let result;
  if (ctx.measureText(content).width <= maxWidth) {
    result = content;
  } else {
    for (let i = 0; i < content.length; i++) {
      drawText += content[i];
      if (ctx.measureText(drawText).width >= maxWidth) {
        result = drawText.substr(0, i - 2);
        const secondLine = content.substr(i - 2);
        result = result + '\n' + getEllipsisText(secondLine, maxWidth);
        break;
      }
    }
  }
  return result;
}
