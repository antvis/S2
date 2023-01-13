import React from 'react';
import { Radio as AntdRadio, type RadioChangeEvent } from 'antd';
import { map } from 'lodash';
import { type S2DataConfig } from '@antv/s2';
import { BaseComponent } from '../base';
import { DraggerUpload } from '../dragger-upload';

export class Radio extends BaseComponent {
  state = {
    isModalOpen: false,
  };

  openDraggerUploadModal = (value: string) => {
    if (value === 'localImport') {
      this.setState({ isModalOpen: true });
    }
  };

  changeDataSource = (
    importData: S2DataConfig | undefined,
    isModalOpen: boolean,
  ) => {
    const { onChange } = this.props;
    onChange({ importData });
    this.setState({ isModalOpen });
  };

  renderContent() {
    const { config, onChange, disable } = this.props;
    const { isModalOpen } = this.state;
    const { attributeId, options, defaultValue } = config;

    return (
      <>
        <AntdRadio.Group
          defaultValue={defaultValue}
          size="small"
          disabled={disable}
          onChange={(e: RadioChangeEvent) => {
            onChange({ [attributeId]: e.target.value });
            this.openDraggerUploadModal(e.target.value);
          }}
        >
          {map(options, (option) => {
            return (
              <AntdRadio.Button key={option.value} value={option.value}>
                {option.label}
              </AntdRadio.Button>
            );
          })}
        </AntdRadio.Group>
        <DraggerUpload
          isModalOpen={isModalOpen}
          changeDataSource={this.changeDataSource}
        />
      </>
    );
  }
}
