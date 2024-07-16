import { getOffscreenCanvas, removeOffscreenCanvas } from '@/utils';
import { sleep } from './../../util/helpers';

describe('Canvas Utils Tests', () => {
  const ID = 's2-offscreen-canvas';

  test('should get offscreen canvas', () => {
    const canvas = getOffscreenCanvas();

    expect(canvas.id).toEqual(ID);
    expect(document.getElementById(ID)).toBeTruthy();
  });

  test('should remove offscreen canvas', async () => {
    getOffscreenCanvas();

    await sleep(500);

    removeOffscreenCanvas();
    expect(document.getElementById(ID)).toBeFalsy();
  });
});
