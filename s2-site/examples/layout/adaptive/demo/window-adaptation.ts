import { PivotSheet, S2Event, S2Options } from '@antv/s2';
import { debounce } from 'lodash';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();

    const debounceRender = debounce(async (width, height) => {
      s2.changeSheetSize(width, height);
      await s2.render(false);
    }, 200);

    const resizeObserver = new ResizeObserver(([entry] = []) => {
      const [size] = entry.borderBoxSize || [];

      debounceRender(size.inlineSize, size.blockSize);
    });

    // 通过监听 document.body 来实现监听窗口大小变化
    resizeObserver.observe(document.body);

    // 别忘了表格销毁时取消监听
    s2.on(S2Event.LAYOUT_DESTROY, () => {
      resizeObserver.disconnect();
    });
  });
