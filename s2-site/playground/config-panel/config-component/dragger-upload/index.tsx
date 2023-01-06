import React, { PureComponent } from 'react';
import { Modal, Upload, message } from 'antd';
import { RcFile, UploadFile } from 'antd/lib/upload';
import { InboxOutlined } from '@ant-design/icons';
import { isObject, has } from 'lodash';
import { type S2DataConfig } from '@antv/s2';
import './index.less';

const { Dragger } = Upload;

type Props = {
  isModalOpen: boolean;
  changeDataSource: (
    importData: S2DataConfig | undefined,
    isModalOpen: boolean,
  ) => void;
};

export class DraggerUpload extends PureComponent<Props> {
  private importData: S2DataConfig | undefined;

  handleConfirm = () => {
    const { changeDataSource } = this.props;
    if (this.importData) {
      changeDataSource(this.importData, false);
      message.success('本地数据导入成功！');
    } else {
      message.error('导入文件有误，请重新导入！');
    }
  };

  handleCancel = () => {
    const { changeDataSource } = this.props;
    changeDataSource(undefined, false);
  };

  verifyImportData = (jsonData: S2DataConfig | undefined) => {
    if (!isObject(jsonData)) {
      return false;
    }
    return has(jsonData, 'data') && has(jsonData, 'fields');
  };

  uploadConfig = (file: RcFile) => {
    if (window.FileReader) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          try {
            // @ts-ignore: 'string | ArrayBuffer' is not assignable to parameter of type 'string'
            const jsonData = JSON.parse(reader.result);
            if (this.verifyImportData(jsonData)) {
              this.importData = jsonData;
            } else {
              message.error('导入数据格式有误，请重新导入！');
            }
          } catch (err) {
            this.importData = undefined;
            message.error('导入数据格式有误，请重新导入！');
          }
        }
      };
      reader.readAsText(file);
    } else {
      message.error('您当前浏览器不支持 FileReader，建议使用谷歌浏览器！');
    }
    return false;
  };

  onRemove = (file: UploadFile) => {
    this.importData = undefined;
  };

  render() {
    const { isModalOpen } = this.props;
    return (
      <Modal
        open={isModalOpen}
        title="本地数据导入"
        onOk={this.handleConfirm}
        onCancel={this.handleCancel}
      >
        <p>目前仅支持的文件格式为 JSON。</p>
        <p>
          JSON 数据必须包含原始数据{' '}
          <a
            href="https://s2.antv.antgroup.com/api/general/s2dataconfig#data"
            target="_blank"
            rel="noopener noreferrer"
          >
            data
          </a>
          ，维度指标{' '}
          <a
            href="https://s2.antv.antgroup.com/api/general/s2dataconfig#fields"
            target="_blank"
            rel="noopener noreferrer"
          >
            fields
          </a>
          ；可选参数有总计/小计数据{' '}
          <a
            href="https://s2.antv.antgroup.com/api/general/s2dataconfig#data"
            target="_black"
            rel="noopener noreferrer"
          >
            totalData
          </a>
          、字段元数据{' '}
          <a
            href="https://s2.antv.antgroup.com/api/general/s2dataconfig#meta"
            target="_black"
            rel="noopener noreferrer"
          >
            meta
          </a>
          、排序参数配置{' '}
          <a
            href="https://s2.antv.antgroup.com/api/general/s2dataconfig#sortparam"
            target="_black"
            rel="noopener noreferrer"
          >
            sortParams
          </a>
          。参考数据格式见：
          <a
            href="https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json"
            target="_black"
            rel="noopener noreferrer"
          >
            标准透视表数据
          </a>
          。
        </p>
        <Dragger
          accept=".json"
          maxCount={1}
          beforeUpload={this.uploadConfig}
          onRemove={this.onRemove}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>点击或将数据文件拖拽到这里导入。</p>
        </Dragger>
      </Modal>
    );
  }
}
