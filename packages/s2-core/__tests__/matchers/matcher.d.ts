declare global {
  namespace jest {
    interface Matchers<R> {
      toBeColor(hexString: string): R;
    }
  }
}

export {};
