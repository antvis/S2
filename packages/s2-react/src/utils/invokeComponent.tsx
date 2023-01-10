import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import ReactDOM from 'react-dom';
import { SpreadSheetContext } from '../context/SpreadSheetContext';

export type InvokeComponentProps<P> = {
  onCancel: any;
  resolver: (val: boolean) => any;
  params: P;
};

/**
 * 挂载组件
 * @param Component
 * @param params
 * @returns
 */
export function invokeComponent<P>(
  Component: React.ComponentType<InvokeComponentProps<P>>,
  params: P,
  spreadsheet: SpreadSheet,
  id?: string,
  onCleanup?: () => void,
) {
  if (id) {
    const domNode = document.querySelector(`#${id}`);

    if (domNode) {
      const unmountResult = ReactDOM.unmountComponentAtNode(domNode);

      if (unmountResult && domNode.parentNode) {
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
    const unmountResult = ReactDOM.unmountComponentAtNode(container);

    if (unmountResult && container.parentNode) {
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
      ReactDOM.render(
        <SpreadSheetContext.Provider value={spreadsheet}>
          <Component onCancel={close} resolver={resolveCb} params={params} />
        </SpreadSheetContext.Provider>,
        container,
      );
    });
  }

  render();

  return prom;
}
