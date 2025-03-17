import { SingletonRenderer } from '@/renderer';
import { BaseCell, CustomRendererConfig, VideoRendererConfig } from '@/src';
import { Image as GImage } from '@antv/g';

const validImageURL = `https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original`;
const fallbackImageURL = `https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*WxI6T4znRX0AAAAAAAAAAAAAeriAAQ/original`;

describe('SingletonRenderer.render 渲染器测试', () => {
  let mockCell: BaseCell<any>;
  const mockBBox = { x: 0, y: 0, height: 100, width: 200 };

  beforeEach(() => {
    // 初始化模拟单元格实例
    mockCell = {
      getFieldValue: jest.fn(),
      getBBoxByType: jest.fn(() => mockBBox),
      appendChild: jest.fn(),
      getContentPosition: jest.fn(() => ({
        x: 0,
      })),
      getIconStyle: jest.fn(),
      removeChild: jest.fn(),
    } as unknown as BaseCell<any>;
  });
  test('应该正确创建图片元素', async () => {
    // 测试图片渲染类型
    const config: CustomRendererConfig = {
      type: 'IMAGE',
      config: { opacity: 0.8 },
      fallback: fallbackImageURL,
    };

    mockCell.getFieldValue.mockReturnValue(validImageURL);

    await SingletonRenderer.render(config, mockCell);

    // 验证元素创建参数
    expect(mockCell.appendChild).toHaveBeenCalledWith(expect.any(GImage));
    const createdElement = (mockCell.appendChild as jest.Mock).mock.calls[1][0];

    expect(createdElement.style.opacity).toBe(0.8);
  });

  test('应该正确创建视频元素', async () => {
    // 测试视频渲染类型
    const config: VideoRendererConfig = {
      type: 'VIDEO',
      videoConfig: { width: 300, controls: true, autoplay: true },
    };

    mockCell.getFieldValue.mockReturnValue(
      'https://gw.alipayobjects.com/v/huamei_qa8qxu/afts/video/StguTYJvYQMAAAAAAAAAAAAAVoeUAQBr',
    );

    await SingletonRenderer.render(config, mockCell);

    // 验证视频参数合并
    const createdElement = (mockCell.appendChild as jest.Mock).mock.calls[1][0];

    expect(createdElement.style.fill.image.controls).toBe(true); // 检查合并后的视频属性

    await SingletonRenderer.render(config, mockCell);

    // 验证视频参数合并
    const createdElement1 = (mockCell.appendChild as jest.Mock).mock
      .calls[1][0];

    expect(createdElement1.style.fill.image.controls).toBe(true); // 检查合并后的视频属性
  });

  test('应该使用单元格尺寸作为默认配置', async () => {
    // 测试默认尺寸配置逻辑
    const config: CustomRendererConfig = {
      type: 'IMAGE',
      config: {},
    };

    mockCell.getFieldValue.mockReturnValue(validImageURL);

    await SingletonRenderer.render(config, mockCell);

    // 验证默认尺寸应用
    const createdElement = (mockCell.appendChild as jest.Mock).mock.calls[1][0];

    expect(createdElement.style.height).toBe(68); // 来自 mockBBox.height
  });

  test('应该优先使用用户配置尺寸', async () => {
    // 测试用户配置优先级
    const config: CustomRendererConfig = {
      type: 'IMAGE',
      config: { height: 150, width: 250 },
    };

    mockCell.getFieldValue.mockReturnValue(validImageURL);

    await SingletonRenderer.render(config, mockCell);

    // 验证用户配置覆盖
    const createdElement = (mockCell.appendChild as jest.Mock).mock.calls[1][0];

    expect(createdElement.style.height).toBe(150);
    expect(createdElement.style.width).toBe(250);
  });
});
