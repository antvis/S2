import { BaseCell } from '@/cell';
import type { CustomRendererConfig } from '@/common/interface/renderer';
import {
  asyncDrawImage,
  drawCustomCellRenderer,
} from '@/utils/cell/customRenderer';
import { Image as GImage } from '@antv/g';

const validImageURL = `https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original`;
const fallbackImageURL = `https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*WxI6T4znRX0AAAAAAAAAAAAAeriAAQ/original`;

// 基础单元测试配置
describe('自定义单元格渲染器测试', () => {
  let mockCell: BaseCell<any>;
  const mockBBox = { x: 0, y: 0, height: 100, width: 200 };

  beforeEach(() => {
    // 初始化模拟单元格实例
    mockCell = {
      getFieldValue: jest.fn(),
      getBBoxByType: jest.fn(() => mockBBox),
      appendChild: jest.fn(),
    } as unknown as BaseCell<any>;
  });

  describe('asyncDrawImage 图片加载函数测试', () => {
    test('应该成功加载有效图片', async () => {
      // 测试正常加载路径
      const img = await asyncDrawImage(validImageURL);

      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.crossOrigin).toBe('anonymous');
    });

    test('应该在超时后抛出错误', async () => {
      // 测试超时路径
      await expect(
        asyncDrawImage('timeout.jpg', undefined, 10),
      ).rejects.toThrow('Failed to load image and fallback');
    });

    test('应该使用备用图片加载', async () => {
      // 测试主图失败后加载备用图
      const img = await asyncDrawImage(
        'https://www.invalid.jpg',
        fallbackImageURL,
      );

      expect(img).toBeInstanceOf(HTMLImageElement);
    });

    test('应该在主图和备用图都失败时抛出错误', async () => {
      // 测试完全失败路径
      await expect(
        asyncDrawImage('invalid.jpg', 'invalid-fallback.jpg'),
      ).rejects.toThrow('Failed to load image and fallback');
    });
  });

  describe('drawCustomCellRenderer 渲染器测试', () => {
    test('应该正确创建图片元素', async () => {
      // 测试图片渲染类型
      const config: CustomRendererConfig = {
        type: 'IMAGE',
        config: { opacity: 0.8 },
        fallback: fallbackImageURL,
      };

      mockCell.getFieldValue.mockReturnValue(validImageURL);

      await drawCustomCellRenderer(config, mockCell);

      // 验证元素创建参数
      expect(mockCell.appendChild).toHaveBeenCalledWith(expect.any(GImage));
      const createdElement = (mockCell.appendChild as jest.Mock).mock
        .calls[0][0];

      expect(createdElement.style.keepAspectRatio).toBe(true);
      expect(createdElement.style.opacity).toBe(0.8);
    });

    test('应该正确创建视频元素', async () => {
      // 测试视频渲染类型
      const config: CustomRendererConfig = {
        type: 'VIDEO',
        config: { width: 300, controls: true },
      };

      mockCell.getFieldValue.mockReturnValue(
        'https://gw.alipayobjects.com/v/huamei_qa8qxu/afts/video/StguTYJvYQMAAAAAAAAAAAAAVoeUAQBr',
      );

      await drawCustomCellRenderer(config, mockCell);

      // 验证视频参数合并
      const createdElement = (mockCell.appendChild as jest.Mock).mock
        .calls[0][0];

      expect(createdElement.style.innerHTML.controls).toBe(true); // 检查合并后的视频属性
    });

    test('应该正确创建HTML元素', async () => {
      // 测试HTML渲染类型
      const config: CustomRendererConfig = {
        type: 'HTML',
        config: { fontSize: 16 },
      };

      mockCell.getFieldValue.mockReturnValue('<div>测试内容</div>');

      await drawCustomCellRenderer(config, mockCell);

      // 验证HTML参数合并
      const createdElement = (mockCell.appendChild as jest.Mock).mock
        .calls[0][0];

      expect(createdElement.style.innerHTML).toBe('<div>测试内容</div>');
      expect(createdElement.style.fontSize).toBe(16);
    });

    test('应该使用单元格尺寸作为默认配置', async () => {
      // 测试默认尺寸配置逻辑
      const config: CustomRendererConfig = {
        type: 'IMAGE',
        config: {},
      };

      mockCell.getFieldValue.mockReturnValue(validImageURL);

      await drawCustomCellRenderer(config, mockCell);

      // 验证默认尺寸应用
      const createdElement = (mockCell.appendChild as jest.Mock).mock
        .calls[0][0];

      expect(createdElement.style.height).toBe(100); // 来自 mockBBox.height
    });

    test('应该优先使用用户配置尺寸', async () => {
      // 测试用户配置优先级
      const config: CustomRendererConfig = {
        type: 'IMAGE',
        config: { height: 150, width: 250 },
      };

      mockCell.getFieldValue.mockReturnValue(validImageURL);

      await drawCustomCellRenderer(config, mockCell);

      // 验证用户配置覆盖
      const createdElement = (mockCell.appendChild as jest.Mock).mock
        .calls[0][0];

      expect(createdElement.style.height).toBe(150);
      expect(createdElement.style.width).toBe(250);
    });
  });
});
