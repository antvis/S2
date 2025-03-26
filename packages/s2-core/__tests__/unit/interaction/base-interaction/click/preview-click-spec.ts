import { BaseCell } from '@/cell';
import { CellType, S2_PREFIX_CLS, S2Event } from '@/common/constant';
import {
  bindMediaClick,
  PreviewClick,
} from '@/interaction/base-interaction/click/preview-click';

const validImageURL = `https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original`;
const validVideoURL = `https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ`;

describe('点击事件绑定测试', () => {
  test('图片渲染应该阻止默认行为和事件冒泡', async () => {
    // 初始化模拟单元格
    const mockCell: BaseCell<any> = {
      getRenderer: jest.fn(() => ({ type: 'IMAGE' })),
      getFieldValue: jest.fn(() => validImageURL),
      getStyle: jest.fn(() => ({})),
    } as unknown as BaseCell<any>;

    await bindMediaClick(mockCell);

    await new Promise((r) => {
      setTimeout(r, 1000);
    });

    const overlay = document.querySelector(`.${S2_PREFIX_CLS}-preview-overlay`);

    overlay.dispatchEvent(new Event('click', { bubbles: true }));

    expect(
      document.querySelector(`.${S2_PREFIX_CLS}-preview-overlay`),
    ).toBeNull();
  });

  test('视频渲染应该阻止默认行为和事件冒泡', async () => {
    // 初始化模拟单元格
    const mockCell: BaseCell<any> = {
      getRenderer: jest.fn(() => ({ type: 'VIDEO' })),
      getFieldValue: jest.fn(() => validVideoURL),
      getStyle: jest.fn(() => ({})),
    } as unknown as BaseCell<any>;

    await bindMediaClick(mockCell);

    await new Promise((r) => {
      setTimeout(r, 1000);
    });

    const overlay = document.querySelector(`.${S2_PREFIX_CLS}-preview-overlay`);

    overlay.dispatchEvent(new Event('click', { bubbles: true }));

    expect(
      document.querySelector(`.${S2_PREFIX_CLS}-preview-overlay`),
    ).toBeNull();
  });

  test('当配置禁用预览时不应该创建元素', () => {
    // 配置禁用预览
    const mockCell: BaseCell<any> = {
      getRenderer: jest.fn(() => ({
        type: 'IMAGE',
        clickToPreview: false,
      })),
      getFieldValue: jest.fn(() => 'test.mp4'),
      getStyle: jest.fn(() => ({})),
    } as unknown as BaseCell<any>;

    bindMediaClick(mockCell);

    expect(mockCell.getStyle).not.toHaveBeenCalled();
  });
});

describe('预览事件处理类测试', () => {
  let previewInstance: PreviewClick;
  const mockSpreadsheet = {
    on: jest.fn(),
    getCell: jest.fn(),
    isPivotMode: jest.fn(() => true),
    emit: jest.fn(() => {}),
  };

  beforeEach(() => {
    previewInstance = new PreviewClick(mockSpreadsheet as any);
  });

  test('应该绑定正确的事件类型', () => {
    previewInstance.bindEvents();

    // 验证事件监听
    expect(mockSpreadsheet.on).toHaveBeenCalledWith(
      S2Event.DATA_CELL_CLICK,
      expect.any(Function),
    );
    expect(mockSpreadsheet.on).toHaveBeenCalledWith(
      S2Event.ROW_CELL_CLICK,
      expect.any(Function),
    );
  });

  test('应该在透视模式下触发预览', () => {
    // 模拟有效单元格
    const mockCell = {
      cellType: CellType.DATA_CELL,
      getRenderer: jest.fn(() => ({ type: 'VIDEO' })),
      getFieldValue: jest.fn(() => 'test.mp4'),
      getStyle: jest.fn(() => ({})),
    };

    mockSpreadsheet.getCell = jest.fn(() => mockCell);

    // 触发模拟事件
    previewInstance.bindMediaCellClick({});

    // 验证预览调用
    expect(mockCell.getRenderer).toHaveBeenCalled();
  });
});
