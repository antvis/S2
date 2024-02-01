import { StarOutlined } from '@ant-design/icons';
import { BaseTooltip, GEvent, S2Event, SpreadSheet } from '@antv/s2';
import React from 'react';
import type { Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { createMockCellInfo, renderComponent, sleep } from 'tests/util/helpers';
import type { TooltipOperatorMenuOptions } from '../../src/components/tooltip/interface';
import { CustomTooltip } from '@/components/tooltip/custom-tooltip';
import type { SheetComponentOptions } from '@/components/sheets/interface';
import { SheetComponent } from '@/components/sheets';

const s2Options: SheetComponentOptions = {
  width: 200,
  height: 200,
  hd: false,
  tooltip: {
    enable: true,
  },
};

let s2: SpreadSheet;

function MainLayout() {
  return (
    <SheetComponent
      adaptive={false}
      sheetType="pivot"
      dataCfg={mockDataConfig}
      options={s2Options}
      themeCfg={{ name: 'default' }}
      onMounted={(instance) => {
        s2 = instance;
      }}
    />
  );
}

describe('SheetComponent Tooltip Tests', () => {
  let unmount: Root['unmount'];

  beforeEach(() => {
    unmount = renderComponent(<MainLayout />);
  });

  afterEach(() => {
    unmount?.();
  });

  // https://github.com/antvis/S2/issues/828

  test('should not throw error if multiple call showTooltip', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await sleep(1000);

    const showTooltip = async () => {
      await s2.showTooltip({
        position: {
          x: 0,
          y: 0,
        },
        content: '111',
      });
    };

    act(() => {
      Array.from({ length: 10 }).forEach(() => {
        expect(showTooltip).not.toThrow();
      });
    });

    await showTooltip();

    expect(errorSpy).not.toHaveBeenCalledWith(
      `Uncaught DOMException: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`,
    );

    errorSpy.mockRestore();
  });

  test('should init custom tooltip and instance of BaseTooltip', async () => {
    await sleep(1000);
    expect(s2.tooltip).toBeInstanceOf(BaseTooltip);
    expect(s2.tooltip).toBeInstanceOf(CustomTooltip);
  });

  test('should get render options', async () => {
    await sleep(1000);
    const { render } = s2.options.tooltip!;

    expect(render).toBeFunction();
    expect(render!(s2)).toBeInstanceOf(CustomTooltip);
  });

  test('should render tooltip content for jsx element', async () => {
    await sleep(1000);
    const content = <div id="custom-content">content</div>;

    await s2.showTooltip({
      position: { x: 0, y: 0 },
      content,
    });

    expect(
      s2.tooltip.container!.querySelector('#custom-content')?.innerHTML,
    ).toEqual('content');
  });

  test('should support callback tooltip content for string', async () => {
    await sleep(1000);

    await s2.showTooltip({
      position: {
        x: 10,
        y: 10,
      },
      content: () => 'custom callback content',
    });

    expect(s2.tooltip.container!.innerText).toEqual('custom callback content');
  });

  test('should support callback tooltip content for element', async () => {
    await sleep(1000);

    const content = (
      <div id="custom-callback-content">custom callback content</div>
    );

    await s2.showTooltip({
      position: {
        x: 10,
        y: 10,
      },
      content: () => content,
    });

    expect(
      s2.tooltip.container!.querySelector('#custom-callback-content'),
    ).toBeTruthy();
  });

  // https://github.com/antvis/S2/issues/852
  test('should not show unique key prop warning', async () => {
    await sleep(1000);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const content = (
      <div>
        <div>content1</div>
        <div>content2</div>
      </div>
    );

    act(() => {
      Array.from({ length: 3 }).forEach(() => {
        s2.showTooltip({
          position: {
            x: 10,
            y: 10,
          },
          content,
        });
      });
    });

    expect(errorSpy).not.toThrow();
    expect(warnSpy).not.toThrow();

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  // https://github.com/antvis/S2/issues/873
  test('should not throw error when hover trend icon', async () => {
    await sleep(1000);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockCell = createMockCellInfo('test', { rowIndex: 0, colIndex: 0 });

    s2.getCell = () => mockCell.mockCell;

    s2.emit(S2Event.DATA_CELL_CLICK, { stopPropagation: () => {} } as GEvent);

    document
      .querySelector('.ant-dropdown-trigger')
      ?.dispatchEvent(new Event('click'));

    expect(errorSpy).not.toThrow(
      'Uncaught Error: React.Children.only expected to receive a single React element child.',
    );

    errorSpy.mockRestore();
  });

  test('should support render ReactNode for operator menus', async () => {
    await sleep(1000);

    await s2.showTooltip<React.ReactNode, TooltipOperatorMenuOptions>({
      position: { x: 0, y: 0 },
      options: {
        operator: {
          menu: {
            items: [
              {
                key: 'menu-a',
                label: <div className="menu-text">text</div>,
                icon: <StarOutlined className="menu-icon" />,
              },
            ],
          },
        },
      },
    });

    const { container } = s2.tooltip;
    const customMenuTextNode = container?.querySelector('.menu-text');

    expect(customMenuTextNode).toBeTruthy();
    expect(customMenuTextNode?.innerHTML).toEqual('text');
    expect(container?.querySelector('.menu-icon')).toBeTruthy();
  });

  test('should get tooltip container after async rendered', async () => {
    await sleep(1000);

    const callback = jest.fn();

    await s2
      .showTooltip({
        position: { x: 0, y: 0 },
        content: () => <div>1</div>,
      })
      .then(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should not throw ReactDOM.render is no longer supported warning', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await sleep(1000);

    await s2.showTooltip({
      position: {
        x: 0,
        y: 0,
      },
      content: <div>1</div>,
    });

    expect(errorSpy).not.toHaveBeenCalledWith(
      `Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot`,
    );

    errorSpy.mockRestore();
  });

  test('should not throw ReactDOM 18 async unmount warning', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await sleep(1000);

    await s2.showTooltip({
      position: {
        x: 0,
        y: 0,
      },
      content: <div>1</div>,
    });

    await sleep(500);

    s2.destroyTooltip();

    expect(errorSpy).not.toHaveBeenCalledWith(
      `Warning: Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition.`,
    );

    errorSpy.mockRestore();
  });

  test.each([{ forceRender: true }, { forceRender: false }])(
    'should not unmount component after show tooltip and %o',
    async ({ forceRender }) => {
      await sleep(1000);

      const forceClearContentSpy = jest
        .spyOn(s2.tooltip as CustomTooltip, 'forceClearContent')
        .mockImplementationOnce(() => {});

      const unmountSpy = jest
        .spyOn(s2.tooltip as CustomTooltip, 'unmount')
        .mockImplementationOnce(() => {});

      act(async () => {
        await s2.showTooltip({
          position: { x: 0, y: 0 },
          options: { forceRender },
        });
        s2.showTooltipWithInfo({} as MouseEvent, [], { forceRender });
        s2.hideTooltip();
      });

      expect(forceClearContentSpy).toHaveBeenCalledTimes(forceRender ? 1 : 0);

      // React 18 unmount 只能调用一次, 所以 forceRender 不应该通过 unmount 的方式来触发
      expect(unmountSpy).toHaveBeenCalledTimes(0);

      s2.tooltip.destroy();
    },
  );
});
