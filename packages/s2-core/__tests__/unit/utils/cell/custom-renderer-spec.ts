import {
  asyncDrawImage,
  calculateImageSize,
} from '@/utils/cell/customRenderer';

const validImageURL = `https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original`;
const fallbackImageURL = `https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*WxI6T4znRX0AAAAAAAAAAAAAeriAAQ/original`;

// 基础单元测试配置
describe('自定义单元格渲染器测试', () => {
  describe('asyncDrawImage 图片加载函数测试', () => {
    test('应该成功加载有效图片', async () => {
      // 测试正常加载路径
      const img = await asyncDrawImage({ src: validImageURL });

      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.crossOrigin).toBe('anonymous');
    });

    test('应该在超时后抛出错误', async () => {
      // 测试超时路径
      await expect(
        asyncDrawImage({
          src: 'timeout.jpg',
          fallback: undefined,
          timeout: 10,
        }),
      ).rejects.toThrow('Failed to load image and fallback');
    });

    test('应该使用备用图片加载', async () => {
      // 测试主图失败后加载备用图
      const img = await asyncDrawImage({
        src: 'https://www.invalid.jpg',
        fallback: fallbackImageURL,
      });

      expect(img).toBeInstanceOf(HTMLImageElement);
    });

    test('应该在主图和备用图都失败时抛出错误', async () => {
      // 测试完全失败路径
      await expect(
        asyncDrawImage({
          src: 'invalid.jpg',
          fallback: 'invalid-fallback.jpg',
        }),
      ).rejects.toThrow('Failed to load image and fallback');
    });
  });
});

describe('图片尺寸计算函数测试', () => {
  test('当容器和图片尺寸都有效时，正确按比例缩放', () => {
    // 宽受限场景
    expect(calculateImageSize(800, 600, 1600, 900)).toEqual({
      width: 800,
      height: 450,
    });
    // 高受限场景
    expect(calculateImageSize(600, 400, 300, 600)).toEqual({
      width: 200,
      height: 400,
    });
    // 等比例缩放
    expect(calculateImageSize(100, 100, 200, 200)).toEqual({
      width: 100,
      height: 100,
    });
  });

  test('当容器宽度<=0时，返回0尺寸', () => {
    expect(calculateImageSize(0, 600, 100, 100)).toEqual({
      width: 0,
      height: 0,
    });
    expect(calculateImageSize(-100, 600, 100, 100)).toEqual({
      width: 0,
      height: 0,
    });
  });

  test('当容器高度<=0时，返回0尺寸', () => {
    expect(calculateImageSize(800, 0, 100, 100)).toEqual({
      width: 0,
      height: 0,
    });
    expect(calculateImageSize(800, -50, 100, 100)).toEqual({
      width: 0,
      height: 0,
    });
  });

  test('当图片原始宽度<=0时，返回容器尺寸', () => {
    expect(calculateImageSize(800, 600, 0, 100)).toEqual({
      width: 800,
      height: 600,
    });
    expect(calculateImageSize(800, 600, -100, 100)).toEqual({
      width: 800,
      height: 600,
    });
  });

  test('当图片原始高度<=0时，返回容器尺寸', () => {
    expect(calculateImageSize(800, 600, 100, 0)).toEqual({
      width: 800,
      height: 600,
    });
    expect(calculateImageSize(800, 600, 100, -50)).toEqual({
      width: 800,
      height: 600,
    });
  });

  test('当缩放后尺寸需要向下取整时，正确处理', () => {
    expect(calculateImageSize(100, 100, 299, 199)).toEqual({
      width: 100,
      height: 66,
    });
    expect(calculateImageSize(100, 100, 199, 299)).toEqual({
      width: 66,
      height: 100,
    });
  });

  test('当容器尺寸小于图片原始尺寸时，正确缩小', () => {
    expect(calculateImageSize(50, 50, 100, 100)).toEqual({
      width: 50,
      height: 50,
    });
    expect(calculateImageSize(50, 25, 100, 100)).toEqual({
      width: 25,
      height: 25,
    });
  });

  test('当容器尺寸大于图片原始尺寸时，保持容器尺寸', () => {
    expect(calculateImageSize(200, 200, 100, 100)).toEqual({
      width: 200,
      height: 200,
    });
    expect(calculateImageSize(300, 200, 150, 100)).toEqual({
      width: 300,
      height: 200,
    });
  });
});
