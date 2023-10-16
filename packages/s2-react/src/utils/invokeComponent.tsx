import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SpreadSheetContext } from '../context/SpreadSheetContext';

export type InvokeComponentProps<P> = {
  onCancel: any;
  resolver: (val: boolean) => any;
  params: P;
};

export type InvokeComponentOptions<P> = {
  component: React.ComponentType<InvokeComponentProps<P>>;
  params: P;
  spreadsheet: SpreadSheet;
  id?: string;
  onCleanup?: () => void;
};

/**
 * 挂载组件
 */
export function invokeComponent<P>(options: InvokeComponentOptions<P>) {
  const { id, spreadsheet, params, onCleanup, component: Component } = options;

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

  const container = document.createElement('div');

  if (id) {
    container.id = id;
  }

  document.body.appendChild(container);

  let resolveCb: (value: unknown) => void;
  let rejectCb: (reason?: unknown) => void;

  function destroy() {
    // const unmountResult = ReactDOM.unmountComponentAtNode(container);

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
      createRoot(container!).render(
        <SpreadSheetContext.Provider value={spreadsheet}>
          <Component onCancel={close} resolver={resolveCb} params={params} />
        </SpreadSheetContext.Provider>,
      );
    });
  }

  render();

  return prom;
}
