/* eslint-disable no-console */

['time', 'info', 'warn'].forEach((type) => {
  jest.spyOn(console, type).mockImplementation(() => {});
});

const originalErrorLog = console.error;

jest.spyOn(console, 'error').mockImplementation((msg) => {
  // act 错误堆栈太长了, CI 上面影响观看,简化一下
  if (msg.includes('act(...)')) {
    return originalErrorLog(
      '[@antv/s2-react setup] act error, see: https://reactjs.org/docs/test-utils.html#act',
    );
  }

  originalErrorLog(msg);
});

// https://react.dev/blog/2022/03/08/react-18-upgrade-guide#configuring-your-testing-environment
// eslint-disable-next-line no-undef
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
