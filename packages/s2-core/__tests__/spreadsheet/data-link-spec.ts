import { getContainer } from 'tests/util/helpers';
import s2DataCfg from '../data/simple-data.json';
import { PivotSheet } from '@/sheet-type';
import { S2Event, type S2Options } from '@/common';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  interaction: {
    linkFields: ['price', 'cost'],
  },
};

describe('Data Cell Text Link Tests', () => {
  test('should get correctly call linkFieldJump function when click data cell', () => {
    const s2 = new PivotSheet(getContainer(), s2DataCfg, s2Options);
    s2.render();

    const linkFieldJump = jest.fn();
    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);

    const canvas = s2.getCanvasElement();
    const { x, top } = canvas.getBoundingClientRect();

    canvas.dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: x + 288,
        clientY: top + 75,
      }),
    );
    canvas.dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: x + 288,
        clientY: top + 75,
      }),
    );

    expect(linkFieldJump).toBeCalledTimes(1);
  });
});
