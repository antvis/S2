export const safeJsonParse = <T = unknown>(val: string): T | null => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return null;
  }
};
