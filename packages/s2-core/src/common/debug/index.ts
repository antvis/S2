/* eslint-disable no-console */

export const DEBUG_TRANSFORM_DATA = 'Transform Data';
export const DEBUG_HEADER_LAYOUT = 'Header Layout';
export const DEBUG_VIEW_RENDER = 'Data Cell Render';

export class DebuggerUtil {
  private static instance: DebuggerUtil;

  private debug = false;

  public static getInstance() {
    if (!DebuggerUtil.instance) {
      DebuggerUtil.instance = new DebuggerUtil();
    }
    return DebuggerUtil.instance;
  }

  public setDebug(debug: boolean) {
    this.debug = debug;
  }

  public debugCallback = (info: string, callback: () => void) => {
    if (this.debug) {
      const start = performance.now();
      callback();
      const end = performance.now();
      console.log(info, `${end - start} ms`);
    } else {
      callback();
    }
  };

  public logger = (info: string, ...params: unknown[]) => {
    if (this.debug) {
      console.log(info, ...params);
    }
  };
}
