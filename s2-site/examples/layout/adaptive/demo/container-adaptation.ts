import { PivotSheet, S2Event, S2Options } from '@antv/s2';
import { debounce } from 'lodash';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    container.innerHTML =
      '<div style="width: 100%; height: 600px; display: flex; flex-flow: row nowrap; "> ' +
      '<p id="side" style="flex-basis: 100px; width: 100px"> 这是一个新的node</p> <div id="content" style="width: 600px "></div> ' +
      '</div>';

    const content = document.getElementById('content');

    setTimeout(() => {
      content.style.width = '300px';
    }, 1000);

    const s2Options: S2Options = {
      width: 600,
      height: 480,
    };

    const s2 = new PivotSheet(content, dataCfg, s2Options);

    await s2.render();

    const debounceRender = debounce(async (width, height) => {
      s2.changeSheetSize(width, height);
      await s2.render(false);
    }, 200);

    const resizeObserver = new ResizeObserver(([entry] = []) => {
      const [size] = entry.borderBoxSize || [];

      debounceRender(size.inlineSize, size.blockSize);
    });

    resizeObserver.observe(content);

    // 别忘了表格销毁时取消监听
    s2.on(S2Event.LAYOUT_DESTROY, () => {
      resizeObserver.disconnect();
    });
  });
