/* eslint-disable no-console */
['time', 'info', 'warn'].forEach((type) => {
  jest.spyOn(console, type).mockImplementation(() => {});
});

const originalErrorLog = console.error;

jest.spyOn(console, 'error').mockImplementation((msg) => {
  // act 错误堆栈太长了, CI 上面影响观看,简化一下
  if (msg.includes('act(...)')) {
    return originalErrorLog(
      'act error, see: https://reactjs.org/docs/test-utils.html#act',
    );
  }

  originalErrorLog(msg);
});
