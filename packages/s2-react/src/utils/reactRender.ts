/**
 * 参考 react-component/util 同时兼容 React 16/17/18 的挂载和卸载
 * @link https://github.com/react-component/util/blob/677d3ac177d147572b65af63e67a7796a5104f4c/src/React/render.ts
 */
import { version } from 'react';
import * as ReactDOM from 'react-dom';
import type { Root } from 'react-dom/client';

const REACT_ROOT_SYMBOL_ID = `__s2_react_root__`;

type ContainerType = (Element | DocumentFragment) & {
  [REACT_ROOT_SYMBOL_ID]?: Root;
};

type CreateRoot = (container: ContainerType) => Root;

const ReactDOMClone = {
  ...ReactDOM,
} as typeof ReactDOM & {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
    usingClientEntryPoint?: boolean;
  };
  createRoot?: CreateRoot;
};

const { render: reactOriginalRender, unmountComponentAtNode } = ReactDOMClone;

let createRoot: CreateRoot;

try {
  const mainVersion = Number((version || '').split('.')[0]);

  if (mainVersion >= 18) {
    createRoot = ReactDOMClone.createRoot!;
  }
} catch (e) {
  // < React 18
}

export const isLegacyReactVersion = () => {
  return !createRoot;
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

function modernRender(
  node: React.ReactElement | null,
  container: ContainerType,
): Root {
  toggleWarning(true);
  const root = container[REACT_ROOT_SYMBOL_ID] || createRoot(container);

  toggleWarning(false);

  root.render(node);

  container[REACT_ROOT_SYMBOL_ID] = root;

  return root;
}

function legacyRender(
  node: React.ReactElement | null,
  container: ContainerType,
) {
  reactOriginalRender(node!, container);
}

export function reactRender(
  node: React.ReactElement | null,
  container: ContainerType,
) {
  if (!isLegacyReactVersion()) {
    modernRender(node, container);

    return;
  }

  legacyRender(node, container);
}

// ========================= Unmount ==========================
function modernUnmount(container: ContainerType) {
  // https://github.com/facebook/react/issues/25675#issuecomment-1363957941
  return Promise.resolve().then(() => {
    container?.[REACT_ROOT_SYMBOL_ID]?.unmount();

    delete container?.[REACT_ROOT_SYMBOL_ID];
  });
}

function legacyUnmount(container: ContainerType) {
  if (container) {
    unmountComponentAtNode(container);
  }
}

export function reactUnmount(container: ContainerType) {
  if (!isLegacyReactVersion()) {
    return modernUnmount(container);
  }

  return legacyUnmount(container);
}

export function forceClear(container: ContainerType) {
  if (isLegacyReactVersion()) {
    legacyUnmount(container);

    return;
  }

  modernRender(null, container);
}
