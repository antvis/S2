require('./matchers');

['time', 'info', 'warn'].forEach((type) => {
  jest.spyOn(console, type).mockImplementation(() => {});
});

jest.mock('@/ui/hd-adapter', () => {
  return {
    HdAdapter: jest.fn().mockImplementation(() => {
      return {
        init: jest.fn(),
        destroy: jest.fn(),
      };
    }),
  };
});

jest.setTimeout(60 * 1000);
