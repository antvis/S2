import { GuiIcon } from '@/common/icons/gui-icon';
import { ArrowDown } from '@/common/icons/svg/svgs';
import { CustomImage } from '@/engine/CustomImage';
import { Group } from '@antv/g';
import { registerIcon } from '../../../../src/common/icons';
import { createPivotSheet, sleep } from '../../../util/helpers';

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
    const oldVal = icon.iconImageShape.style.src;

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
          src: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
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

  // https://github.com/antvis/S2/issues/3125
  describe('CSP-compatible Path mode rendering', () => {
    test('should render built-in SVG icons using Path mode', () => {
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const icon = new GuiIcon({
        name: 'Plus',
        x: 10,
        y: 10,
        width: 16,
        height: 16,
      });

      // Path 模式下应该有 iconPathShapes
      expect(icon.iconPathShapes.length).toBeGreaterThan(0);
      // Path 模式下不应该使用 Image
      expect(icon.iconImageShape).toBeUndefined();
      expect(icon).toBeInstanceOf(Group);
      expect(errSpy).not.toHaveBeenCalled();

      errSpy.mockRestore();
    });

    test('should render Minus icon using Path mode', () => {
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const icon = new GuiIcon({
        name: 'Minus',
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      });

      expect(icon.iconPathShapes.length).toBeGreaterThan(0);
      expect(icon.iconImageShape).toBeUndefined();
      expect(errSpy).not.toHaveBeenCalled();

      errSpy.mockRestore();
    });

    test('should apply cursor style to Path mode icons', () => {
      const icon = new GuiIcon({
        name: 'Plus',
        x: 0,
        y: 0,
        width: 16,
        height: 16,
        cursor: 'pointer',
      });

      expect(icon.iconPathShapes.length).toBeGreaterThan(0);

      // 第一个 shape 是 hitArea Rect，应该有 cursor 样式
      const hitAreaRect = icon.iconPathShapes[0];

      expect(hitAreaRect.style.cursor).toBe('pointer');
    });

    test('should render tree icons in tree mode table without errors', async () => {
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const s2 = createPivotSheet({
        width: 400,
        height: 300,
        hierarchyType: 'tree',
      });

      await s2.render();

      // 验证没有 CSP 或 SVG 解析错误
      expect(errSpy).not.toHaveBeenCalled();

      // 验证 row cells 存在 (tree mode 应该有展开折叠图标)
      const rowCells = s2.facet.getRowCells();

      expect(rowCells.length).toBeGreaterThan(0);

      s2.destroy();
      errSpy.mockRestore();
    });

    test('should update fill color in Path mode', () => {
      const icon = new GuiIcon({
        name: 'Plus',
        x: 0,
        y: 0,
        width: 16,
        height: 16,
        fill: 'red',
      });

      expect(icon.iconPathShapes.length).toBeGreaterThan(0);

      // 更新 fill
      icon.setImageAttrs({ fill: 'blue' });

      // Path shapes 的 fill 应该更新
      const pathShape = icon.iconPathShapes[1]; // 第一个是 hitArea

      expect(pathShape.style.fill).toBe('blue');
    });

    test('should reRender icon with new name in Path mode', () => {
      const icon = new GuiIcon({
        name: 'Plus',
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      });

      expect(icon.iconPathShapes.length).toBeGreaterThan(0);

      // reRender with new name
      icon.reRender({
        name: 'Minus',
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      });

      expect(icon.name).toBe('Minus');
      expect(icon.iconPathShapes.length).toBeGreaterThan(0);
    });

    test('should updatePosition correctly in Path mode', () => {
      const icon = new GuiIcon({
        name: 'Plus',
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      });

      icon.updatePosition({ x: 50, y: 100 });

      // 验证 path shapes 的 transform 包含新位置
      const pathShape = icon.iconPathShapes[1];

      expect(pathShape.style.transform).toContain('50');
      expect(pathShape.style.transform).toContain('100');
    });

    test('should toggle visibility in Path mode', () => {
      const icon = new GuiIcon({
        name: 'Plus',
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      });

      // 隐藏
      icon.toggleVisibility(false);

      icon.iconPathShapes.forEach((shape) => {
        expect(shape.style.visibility).toBe('hidden');
      });

      // 显示
      icon.toggleVisibility(true);

      icon.iconPathShapes.forEach((shape) => {
        expect(shape.style.visibility).toBe('visible');
      });
    });
  });
});
