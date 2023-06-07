// import type { GetDataCellValueType } from './pivot-data-cell-copy';

// self.onmessage = function (ev) {
//   // move getDataMatrixByHeaderNode to here
//   // const params = ev.data;
//   // const result = getDataMatrixByHeaderNode(params);
//   console.log(ev, 'ev.data');
//   self.postMessage('result');
// };
// worker.js
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event) => {
  const message = event.data;

  // eslint-disable-next-line no-console
  console.log('Worker received message:2222', message);
  // eslint-disable-next-line no-restricted-globals
  self.postMessage(`Hello from Worker! Your message was3333: ${message}`);
});
