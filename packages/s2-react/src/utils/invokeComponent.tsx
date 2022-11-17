import type { SpreadSheet } from '@antv/s2';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SpreadSheetContext } from './SpreadSheetContext';

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

  const div = document.createElement('div');
  if (id) {
    div.id = id;
  }
  document.body.appendChild(div);

  let resolveCb;
  let rejectCb;

  function destroy(...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);

      if (onCleanup) {
        onCleanup();
      }
    }
  }

  function close(...args: any[]) {
    destroy.call(null, ...args);
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
        div,
      );
    });
  }

  render();
  return prom;
}
