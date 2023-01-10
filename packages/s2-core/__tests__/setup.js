require('./matchers');

['time', 'info', 'warn'].forEach((type) => {
  jest.spyOn(console, type).mockImplementation(() => {});
});

jest.mock('@/ui/hd-adapter', () => ({
  HdAdapter: jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    destroy: jest.fn(),
  })),
}));
