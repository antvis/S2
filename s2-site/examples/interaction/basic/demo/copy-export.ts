/* eslint-disable no-console */
import {
  CopyMIMEType,
  PivotSheet,
  S2Event,
  S2Options,
  SpreadSheet,
  asyncGetAllPlainData,
  copyToClipboard,
  download,
} from '@antv/s2';
import { message } from 'antd';

const split = '\t';

const fileName = 'test';

const copyData = async (s2: SpreadSheet, isFormat: boolean) => {
  const customTransformer = () => {
    return {
      [CopyMIMEType.HTML]: () => {
        return {
          type: CopyMIMEType.HTML,
          content: `<td></td>`,
        };
      },
    };
  };

  const data = await asyncGetAllPlainData({
    sheetInstance: s2,
    split,
    formatOptions: isFormat,
    // 自定义转换器: 如复制到语雀等富文本编辑器场景展示空表格
    // customTransformer,
  });

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
  const copyBtn = document.createElement('button');

  copyBtn.className = 'ant-btn ant-btn-default';
  copyBtn.innerHTML = '复制全量数据';

  const exportBtn = document.createElement('button');

  exportBtn.className = 'ant-btn ant-btn-default';
  exportBtn.innerHTML = '导出全量数据';

  exportBtn.addEventListener('click', () => {
    downloadData(s2, true);
  });

  copyBtn.addEventListener('click', () => {
    copyData(s2, true);
  });

  const canvas = document.querySelector('#container > canvas');

  if (canvas) {
    canvas.style.marginTop = '10px';
    canvas.before(copyBtn);
    copyBtn.after(exportBtn);
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
      console.log('局部复制数据', data);
    });

    await s2.render();

    addButtons(s2);
  });
