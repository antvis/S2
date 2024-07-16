export const sleep = async (timeout = 0) => {
  await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
