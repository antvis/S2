import { Group } from '@antv/g';
import { registerIcon } from '../../../../src/common/icons';
import { sleep, createPivotSheet } from '../../../util/helpers';
import { CustomImage } from '@/engine/CustomImage';
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

    expect(icon.name).toEqual('test');
    expect(icon.iconImageShape).toBeInstanceOf(CustomImage);
    expect(icon).toBeInstanceOf(Group);
    expect(errSpy).not.toHaveBeenCalled();
  });

  test('should not render icon with invalid online url', async () => {
    registerIcon('test', 'https://www.test.svg');

    const errSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});

    // eslint-disable-next-line no-new
    new GuiIcon({
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

  test('should be able to update image with setImageAttr function.', () => {
    registerIcon('test', 'SortUp');

    const icon = new GuiIcon({
      name: 'test',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    });

    const spy = jest.spyOn(icon, 'getImage');
    const oldVal = icon.iconImageShape.style.img;

    expect(oldVal).toBeDefined();
    icon.setImageAttrs({ fill: 'red' });
    expect(spy).toHaveBeenCalled();
  });

  // https://github.com/antvis/S2/issues/2513
  test('should support cross origin for online url', () => {
    const s2 = createPivotSheet({
      width: 200,
      height: 200,
      customSVGIcons: [
        {
          name: 'Filter',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
        },
      ],
      headerActionIcons: [
        {
          icons: ['Filter'],
          belongsCell: 'colCell',
          defaultHide: false,
        },
        {
          icons: ['Filter'],
          belongsCell: 'rowCell',
          defaultHide: false,
        },
        {
          icons: ['Filter'],
          belongsCell: 'cornerCell',
          defaultHide: false,
        },
      ],
    });

    async function render() {
      await s2.render();
      s2.getCanvasElement().toDataURL();
    }

    expect(render).not.toThrow();
  });
});
