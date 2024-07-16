import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import { SpreadSheetContext } from '../context/SpreadSheetContext';
import { reactRender, reactUnmount } from './reactRender';

export type InvokeComponentProps<P> = {
  onCancel: () => void;
  resolver: (val: boolean) => void;
  params: P;
};

export type InvokeComponentOptions<P> = {
  component: React.ComponentType<InvokeComponentProps<P>>;
  params: P;
  s2: SpreadSheet;
  id?: string;
  onCleanup?: () => void;
};

/**
 * 挂载组件
 */
export function invokeComponent<P>(options: InvokeComponentOptions<P>) {
  const { id, s2, params, onCleanup, component: Component } = options;

  if (id) {
    const container = document.querySelector(`#${id}`);

    if (container) {
      const result = reactUnmount(container);

      if (result && container.parentNode) {
        container.parentNode.removeChild(container);

        return;
      }
    }
  }

  const container = document.createElement('div');

  if (id) {
    container.id = id;
  }

  document.body.appendChild(container);

  let resolveCb: (value: boolean) => void;
  let rejectCb: (reason?: unknown) => void;

  function destroy() {
    reactUnmount(container);

    if (container.parentNode) {
      container.parentNode.removeChild(container);

      if (onCleanup) {
        onCleanup();
      }
    }
  }

  function onClose() {
    destroy();
    rejectCb();
  }

  const handler = new Promise((resolve, reject) => {
    resolveCb = resolve;
    rejectCb = reject;
  }).then((val) => {
    onClose();

    return val;
  });

  function render() {
    setTimeout(() => {
      reactRender(
        <SpreadSheetContext.Provider value={s2}>
          <Component onCancel={onClose} resolver={resolveCb} params={params} />
        </SpreadSheetContext.Provider>,
        container,
      );
    });
  }

  render();

  return handler;
}
