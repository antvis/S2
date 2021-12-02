import '@testing-library/jest-dom';
['time', 'info', 'warn'].forEach((type) => {
  jest.spyOn(console, type).mockImplementation(() => {});
});
