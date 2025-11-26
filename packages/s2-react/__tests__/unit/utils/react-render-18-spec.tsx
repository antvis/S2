/* eslint-disable jest/no-standalone-expect */
/* eslint-disable react/no-deprecated */

// ================= Mock Setup Starts =================

// 1. 准备 Mock 函数
const mockRootRender = jest.fn();
const mockRootUnmount = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRootRender,
  unmount: mockRootUnmount,
}));

// 2. Mock React Version 为 19.0.0
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    version: '19.0.0',
  };
});

// 3. Mock 'react-dom' (主入口)
// 关键点：故意不返回 createRoot，模拟 React 19 或强制源码去加载 react-dom/client
jest.mock('react-dom', () => {
  return {
    ...jest.requireActual('react-dom'),
    // 模拟 React 19 中可能存在的 legacy 方法（虽然不应该被调用）
    render: jest.fn(),
    unmountComponentAtNode: jest.fn(),
    // 这里不返回 createRoot，迫使源码执行 getCreateRoot 中的 fallback/import 逻辑
  };
});

// 4. Mock 'react-dom/client' (新入口)
// 当源码执行 await import('react-dom/client') 时会用到这个 Mock
jest.mock('react-dom/client', () => {
  return {
    createRoot: mockCreateRoot,
  };
});

// ================= Mock Setup Ends =================

import {
  forceClearContent,
  isLegacyReactVersion,
  reactRender,
  reactUnmount,
  S2_REACT_ROOT_SYMBOL_ID,
} from '@/utils/reactRender'; // 请根据实际路径调整
import ReactDOM from 'react-dom';
// 引入 client 以便在测试中断言 (虽然源码是动态引入，但在测试环境中我们可以直接断言 mock)
import * as ReactDOMClient from 'react-dom/client';

// 简单的容器获取模拟，确保单测独立运行
const getContainer = () => document.createElement('div');

describe('React 19 Render Tests', () => {
  let container: HTMLElement & { [key: string]: any };
  const element = null;

  beforeEach(() => {
    container = getContainer();
    jest.clearAllMocks();
    // 清理容器上的挂载标记，防止测试间污染
    delete container[S2_REACT_ROOT_SYMBOL_ID];
  });

  test('should identify as NOT legacy react version', () => {
    // React 19 肯定不是 legacy
    expect(isLegacyReactVersion()).toBeFalsy();
  });

  test('should use createRoot from react-dom/client and NOT use legacy render', async () => {
    // Act
    await reactRender(element, container);

    // Assert
    // 1. 确保没有调用旧版 render
    expect(ReactDOM.render).toHaveBeenCalledTimes(0);

    // 2. 确保调用了 react-dom/client 的 createRoot
    // 因为我们在 react-dom mock 中故意省略了 createRoot，源码应该去 import client
    expect(ReactDOMClient.createRoot).toHaveBeenCalledTimes(1);
    expect(ReactDOMClient.createRoot).toHaveBeenCalledWith(container);

    // 3. 确保 root.render 被调用
    expect(mockRootRender).toHaveBeenCalledTimes(1);
    expect(mockRootRender).toHaveBeenCalledWith(element);

    // 4. 验证 Root 实例是否被正确挂载到了 container 上
    expect(container[S2_REACT_ROOT_SYMBOL_ID]).toBeDefined();
  });

  test('should reuse existing root if already mounted', async () => {
    // Act 1: 第一次渲染
    await reactRender(element, container);
    const existingRoot = container[S2_REACT_ROOT_SYMBOL_ID];

    // 清除 mock 记录，准备第二次调用
    (ReactDOMClient.createRoot as jest.Mock).mockClear();
    mockRootRender.mockClear();

    // Act 2: 第二次渲染同一个容器
    await reactRender(element, container);

    // Assert
    // 不应该再次创建 Root
    expect(ReactDOMClient.createRoot).toHaveBeenCalledTimes(0);
    // 但应该再次调用 render
    expect(existingRoot.render).toHaveBeenCalledTimes(1);
  });

  test('should use modern unmount (root.unmount)', async () => {
    // Setup: 先渲染以生成 root
    await reactRender(element, container);
    const root = container[S2_REACT_ROOT_SYMBOL_ID];

    expect(root).toBeDefined();

    // Act: 执行卸载
    await reactUnmount(container);

    // Assert
    // 1. 确保旧版卸载方法未被调用
    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(0);

    // 2. 确保调用了 root.unmount()
    expect(mockRootUnmount).toHaveBeenCalledTimes(1);

    // 3. 确保容器上的 Root 引用被清理
    expect(container[S2_REACT_ROOT_SYMBOL_ID]).toBeUndefined();
  });

  test('should use modern render for force clear content', async () => {
    // Act
    const root = await forceClearContent(container);

    // Assert
    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(0);
    expect(ReactDOM.render).toHaveBeenCalledTimes(0);

    // forceClearContent 不会卸载 root，而是 render(null)
    expect(root.unmount).toHaveBeenCalledTimes(0);

    // 确保调用了 createRoot (如果之前没挂载过)
    expect(ReactDOMClient.createRoot).toHaveBeenCalledTimes(1);

    // 关键：确保 render 被调用，且参数为 null
    expect(mockRootRender).toHaveBeenCalledTimes(1);
    expect(mockRootRender).toHaveBeenCalledWith(null);
  });
});
