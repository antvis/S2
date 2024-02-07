import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SpreadSheetContext } from '../context/SpreadSheetContext';

export type InvokeComponentProps<P> = {
  onCancel: any;
  resolver: (val: boolean) => any;
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
    const domNode = document.querySelector(`#${id}`);

    if (domNode) {
      // const unmountResult = ReactDOM.unmountComponentAtNode(domNode);

      if (domNode.parentNode) {
        domNode.parentNode.removeChild(domNode);

        return;
      }
    }
  }

  let root: Root;
  const container = document.createElement('div');

  if (id) {
    container.id = id;
  }

  document.body.appendChild(container);

  let resolveCb: (value: unknown) => void;
  let rejectCb: (reason?: unknown) => void;

  function destroy() {
    root?.unmount();
    if (container.parentNode) {
      container.parentNode.removeChild(container);

      if (onCleanup) {
        onCleanup();
      }
    }
  }

  function close() {
    destroy();
    rejectCb();
  }

  const prom = new Promise((resolve, reject) => {
    resolveCb = resolve;
    rejectCb = reject;
  }).then((val) => {
    close();

    return val;
  });

  function render() {
    setTimeout(() => {
      root = createRoot(container!);

      root.render(
        <SpreadSheetContext.Provider value={s2}>
          <Component onCancel={close} resolver={resolveCb} params={params} />
        </SpreadSheetContext.Provider>,
      );
    });
  }

  render();

  return prom;
}
