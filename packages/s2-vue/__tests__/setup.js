/* eslint-disable no-console */

['time', 'info', 'warn'].forEach((type) => {
  jest.spyOn(console, type).mockImplementation(() => {});
});

const originalErrorLog = console.error;

jest.spyOn(console, 'error').mockImplementation((msg) => {
  // 简化错误日志
  if (typeof msg === 'string' && msg.includes('act(...)')) {
    return originalErrorLog(
      '[@antv/s2-vue setup] act error, see Vue Test Utils documentation',
    );
  }

  originalErrorLog(msg);
});
