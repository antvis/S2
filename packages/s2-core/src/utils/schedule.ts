export function waitForCellMounted(cb: () => void) {
  Promise.resolve().then(() => {
    cb();
  });
}
