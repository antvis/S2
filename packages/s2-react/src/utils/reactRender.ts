/**
 * 兼容 React 16/17/18/19 的挂载和卸载
 */
import { version } from 'react';
import * as ReactDOM from 'react-dom';
import type { Root } from 'react-dom/client';

export const S2_REACT_ROOT_SYMBOL_ID = `__s2_react_root__`;

type ContainerType = (Element | DocumentFragment) & {
  [S2_REACT_ROOT_SYMBOL_ID]?: Root;
};

type CreateRoot = (container: ContainerType) => Root;

// 1. 避免直接解构 render，防止 React 19 报错
// 仅保留类型定义和必要的静态属性引用
const ReactDOMClone = {
  ...ReactDOM,
} as typeof ReactDOM & {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
    usingClientEntryPoint?: boolean;
  };
  createRoot?: CreateRoot;
  // 声明可能存在的 Legacy 方法
  render?: (node: React.ReactElement | null, container: ContainerType) => void;
  unmountComponentAtNode?: (container: ContainerType) => boolean;
};

let createRootFn: CreateRoot | undefined;

// 2. 异步获取 createRoot
// 这是一个懒加载单例，只在第一次渲染时执行
async function getCreateRoot(): Promise<CreateRoot> {
  if (createRootFn) {
    return createRootFn;
  }

  // 优先尝试 React 18 的同步入口 (如果有)
  if (ReactDOMClone.createRoot) {
    createRootFn = ReactDOMClone.createRoot;

    return createRootFn;
  }

  // React 19+ 或 React 18 Client 模式
  try {
    const client = await import('react-dom/client');

    createRootFn = client.createRoot;

    return createRootFn!;
  } catch (e) {
    throw new Error(
      '[S2] React 18+ detected but failed to load createRoot. Please ensure react-dom is installed correctly.',
      { cause: e },
    );
  }
}

export const isLegacyReactVersion = () => {
  const mainVersion = Number((version || '').split('.')[0]);

  return mainVersion < 18;
};

/**
 * 由于兼容的关系, 没有从 "react-dom/client" 引入 createRoot, 会报 warning
 * https://github.com/facebook/react/issues/24372
 */
function toggleWarning(skip: boolean) {
  const { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } = ReactDOMClone;

  if (
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    typeof __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === 'object'
  ) {
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint =
      skip;
  }
}

// ========================== Render ==========================

async function modernRender(
  node: React.ReactElement | null,
  container: ContainerType,
) {
  toggleWarning(true);

  let root = container[S2_REACT_ROOT_SYMBOL_ID];

  if (!root) {
    // 异步等待 createRoot 加载完成
    const createRoot = await getCreateRoot();

    root = createRoot(container);
    container[S2_REACT_ROOT_SYMBOL_ID] = root;
  }

  toggleWarning(false);

  root.render(node);

  return root;
}

function legacyRender(
  node: React.ReactElement | null,
  container: ContainerType,
) {
  const reactRender = ReactDOMClone.render;

  if (reactRender) {
    reactRender(node, container);
  } else {
    throw new Error(
      '[S2] Failed to render. React 16/17 detected but ReactDOM.render is empty',
    );
  }
}

// 注意：这里变成了 async 函数
export async function reactRender(
  node: React.ReactElement | null,
  container: ContainerType,
) {
  if (!isLegacyReactVersion()) {
    await modernRender(node, container);

    return;
  }

  legacyRender(node, container);
}

// ========================= Unmount ==========================

function modernUnmount(container: ContainerType) {
  return Promise.resolve().then(() => {
    container?.[S2_REACT_ROOT_SYMBOL_ID]?.unmount();
    delete container?.[S2_REACT_ROOT_SYMBOL_ID];
  });
}

function legacyUnmount(container: ContainerType) {
  const unmount = ReactDOMClone.unmountComponentAtNode;

  if (container && unmount) {
    unmount(container);
  }
}

export function reactUnmount(container: ContainerType) {
  if (!isLegacyReactVersion()) {
    return modernUnmount(container);
  }

  return legacyUnmount(container);
}

export function forceClearContent(
  container: ContainerType,
): void | Promise<Root> {
  if (isLegacyReactVersion()) {
    return legacyUnmount(container);
  }

  return modernRender(null, container);
}
