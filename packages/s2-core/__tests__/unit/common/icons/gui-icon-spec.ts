import { Group, Shape } from '@antv/g-canvas';
import { registerIcon } from '../../../../src/common/icons';
import { sleep } from '../../../util/helpers';
import { GuiIcon } from '@/common/icons/gui-icon';
import { ArrowDown } from '@/common/icons/svg/svgs';

describe('GuiIcon Tests', () => {
  test('should get gui icon static type', () => {
    expect(GuiIcon.type).toEqual('__GUI_ICON__');
  });

  test.each([
    // 内置
    'SortUp',
    // base64/本地文件
    ArrowDown,
    // 在线链接 (无后缀)
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2VvTSZmI4vYAAAAAAAAAAAAADmJ7AQ/original',
    // 在线链接 (静态)
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*P-jqT4U7YrcAAAAAAAAAAAAADmJ7AQ/original.jpg',
    // 在线链接 (动态)
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*f6e6S4OUSdMAAAAAAAAAAAAADmJ7AQ/original.gif',
    // 在线链接 (webp)
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5nsESLuvc_EAAAAAAAAAAAAADmJ7AQ/fmt.webp',
  ])('should render correctly icon with %s', (src) => {
    const errSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});

    registerIcon('test', src);

    const icon = new GuiIcon({
      name: 'test',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    });

    expect(icon.get('name')).toEqual('test');
    expect(icon.iconImageShape).toBeInstanceOf(Shape.Image);
    expect(icon).toBeInstanceOf(Group);
    expect(icon).toMatchSnapshot();
    expect(errSpy).not.toHaveBeenCalled();
  });

  test('should not render icon with invalid online url', async () => {
    registerIcon('test', 'https://www.test.svg');

    const errSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});

    const icon = new GuiIcon({
      name: 'test',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    });

    await sleep(300);

    expect(errSpy).toHaveBeenCalled();
  });

  test('should get is online link result', () => {
    const icon = new GuiIcon({
      name: 'test',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    });

    expect(icon.isOnlineLink('https://www.test.png')).toBeTruthy();
    expect(icon.isOnlineLink('https://www.test/test')).toBeTruthy();
    expect(icon.isOnlineLink('http://www.test.png')).toBeTruthy();
    expect(icon.isOnlineLink('//www.test.png')).toBeTruthy();
    expect(icon.isOnlineLink('https//www.test.png')).toBeFalsy();
    expect(icon.isOnlineLink('https//www.test.png')).toBeFalsy();
    expect(icon.isOnlineLink('://www.test.png')).toBeFalsy();
    expect(icon.isOnlineLink('')).toBeFalsy();
  });
});
