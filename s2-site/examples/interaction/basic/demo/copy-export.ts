/* eslint-disable no-console */
import {
  PivotSheet,
  S2Event,
  S2Options,
  SpreadSheet,
  asyncGetAllData,
  asyncGetAllHtmlData,
  asyncGetAllPlainData,
  copyToClipboard,
  download,
  type CopyAllDataParams,
  type Copyable,
  type CopyableList,
} from '@antv/s2';
import { message } from 'antd';

const split = '\t';

const fileName = 'test';

const copy = (data: Copyable | string) => {
  copyToClipboard(data)
    .then(() => {
      console.log('data', data);
      message.success('复制成功!');
    })
    .catch((error) => {
      console.log('copy failed: ', error);
      message.error('复制失败!');
    });
};

// 自定义数据转换器: 默认获取的是全量的数据, 可对 `text/plain` 和 `text/html` 进行改写

const copyByCustomTransformer = async (s2: SpreadSheet) => {
  const data = await asyncGetAllData({
    sheetInstance: s2,
    split,
    formatOptions: true,
    customTransformer: () => {
      return {
        'text/plain': (data) => {
          console.log('text/plain', data);

          return {
            type: 'text/plain',
            content: `我是td\t我是td\t我是td`,
          };
        },
        'text/html': (data) => {
          console.log('text/html', data);

          return {
            type: 'text/html',
            content: `<meta charset="utf-8"><table><tbody><tr><td></td><td></td><td>家具</td></tr><tr><td></td><td></td><td>桌子</td></tr><tr><td></td><td></td><td>数量</td></tr><tr><td>浙江省</td><td>杭州市</td><td>7789</td></tr></tbody></table>`,
          };
        },
      };
    },
  });

  copy(data);
};

const copyData = async (
  s2: SpreadSheet,
  isFormat: boolean,
  method: (params: CopyAllDataParams) => Promise<CopyableList | string>,
) => {
  const data = await method?.({
    sheetInstance: s2,
    split,
    formatOptions: isFormat,
  });

  copy(data);
};

const downloadData = async (s2: SpreadSheet, isFormat: boolean) => {
  const close = message.loading('导出中...');
  const data = await asyncGetAllPlainData({
    sheetInstance: s2,
    split,
    formatOptions: isFormat,
  });

  try {
    download(data, fileName);
    console.log('downloadData', data);
    message.success('导出成功!');
  } catch (err) {
    message.error('导出失败!');
  } finally {
    close();
  }
};

function addButtons(s2: SpreadSheet) {
  const [
    copyBtn,
    copyPlainTextBtn,
    copyHtmlTextBtn,
    copyByCustomTransformerBtn,
    exportBtn,
  ] = Array.from({
    length: 5,
  }).map(() => {
    const btn = document.createElement('button');

    btn.className = 'ant-btn ant-btn-default';

    return btn;
  });

  copyBtn.innerHTML = '复制全量数据';
  copyPlainTextBtn.innerHTML = '复制全量数据 (text/plain)';
  copyHtmlTextBtn.innerHTML = '复制全量数据 (text/html)';
  copyByCustomTransformerBtn.innerHTML = '复制全量数据 (自定义转换器)';
  exportBtn.innerHTML = '导出全量数据 (text/plain)';

  copyBtn.addEventListener('click', () => {
    copyData(s2, true, asyncGetAllData);
  });
  copyPlainTextBtn.addEventListener('click', () => {
    copyData(s2, true, asyncGetAllPlainData);
  });
  copyHtmlTextBtn.addEventListener('click', () => {
    copyData(s2, true, asyncGetAllHtmlData);
  });
  copyByCustomTransformerBtn.addEventListener('click', () => {
    copyByCustomTransformer(s2);
  });

  exportBtn.addEventListener('click', () => {
    downloadData(s2, true);
  });

  const canvas = document.querySelector('#container > canvas');

  if (canvas) {
    canvas.style.marginTop = '10px';
    canvas.before(copyBtn);
    canvas.before(copyPlainTextBtn);
    canvas.before(copyHtmlTextBtn);
    canvas.before(copyByCustomTransformerBtn);
    copyByCustomTransformerBtn.after(exportBtn);
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        copy: {
          // 允许复制
          enable: true,
          // 是否携带行列头数据
          withHeader: true,
          // 是否使用格式化数据
          withFormat: true,
        },
        // 刷选
        brushSelection: {
          rowCell: true,
          colCell: true,
          dataCell: true,
        },
        // 多选
        multiSelection: true,
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.GLOBAL_COPIED, (data) => {
      console.log('局部复制数据:', data);
    });

    await s2.render();

    addButtons(s2);
  });
