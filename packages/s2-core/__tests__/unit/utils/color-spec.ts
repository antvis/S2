import { getPalette } from '@/utils';
import { generatePalette } from '@/utils/color';

describe('color test', () => {
  test('should generate palette', () => {
    const colorfulPalette = getPalette('colorful');
    const palette = generatePalette(colorfulPalette, '#F1535F');

    expect(palette.basicColors[0]).toEqual('#FFFFFF');
    expect(palette.basicColors[1]).toEqual('#FEF6F6');
    expect(palette.basicColors[2]).toEqual('#FCE2E4');
    expect(palette.basicColors[3]).toEqual('#F1535F');
    expect(palette.basicColors[4]).toEqual('#CF444F');
    expect(palette.basicColors[5]).toEqual('#CF444F');
    expect(palette.basicColors[6]).toEqual('#FF0112');
    expect(palette.basicColors[7]).toEqual('#ED505C');
    expect(palette.basicColors[8]).toEqual('#FFFFFF');
    expect(palette.basicColors[9]).toEqual('#FDE5E7');
    expect(palette.basicColors[10]).toEqual('#F26C77');
    expect(palette.basicColors[11]).toEqual('#F26C77');
    expect(palette.basicColors[12]).toEqual('#F1535F');
    expect(palette.basicColors[13]).toEqual('#000000');
    expect(palette.basicColors[14]).toEqual('#000000');
  });
});
