['time', 'info'].forEach((type) => {
  jest.spyOn(console, type).mockImplementation(() => {});
});
