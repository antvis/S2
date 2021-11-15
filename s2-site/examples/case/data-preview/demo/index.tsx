import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  SheetComponent,
  S2Options,
  S2DataConfig,
  TableColCell,
  GuiIcon,
  TableCornerCell,
} from '@antv/s2';
import {
  Input,
  Divider,
  Space,
  Button,
  Modal,
  Radio,
  Form,
  InputNumber,
} from 'antd';
import { get } from 'lodash';
import '@antv/s2/dist/s2.min.css';
const { Search } = Input;

class CustomTableColCell extends TableColCell {
  private onIconClick: Function;

  constructor(meta, spreadsheet, headerConfig, callback) {
    super(meta, spreadsheet, headerConfig);
    this.onIconClick = callback;
  }

  protected drawTextShape() {
    super.drawTextShape();

    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    const style = this.getStyle();
    const iconSize = get(style, 'icon.size');
    const iconMargin = get(style, 'icon.margin');

    const iconX = x + cellWidth - iconSize - iconMargin?.right;
    const iconY = y + cellHeight / 2 - iconSize / 2;

    this.renderFilterIcon({
      x: iconX,
      y: iconY,
      width: iconSize,
      height: iconSize,
    });
  }

  protected renderFilterIcon(position) {
    const { x, y, width, height } = position;
    const icon = new GuiIcon({
      name: 'Filter',
      x,
      y,
      width,
      height,
    });
    this.add(icon);

    icon.on('click', () => {
      this.onIconClick?.({
        meta: this.meta,
      });
    });
  }
}

export const filterIcon =
  '<svg t="1633848048963" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="85936" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M0 0h1024L724.676923 488.369231V1024l-425.353846-141.784615v-393.846154L0 0z m196.923077 102.4l204.8 354.461538v362.338462l228.430769 63.015385V456.861538l212.676923-354.461538H196.923077z" opacity=".4" p-id="85937" fill="rgba(0,0,0,0.8)"></path></svg>';
export const sortUp =
  '<svg t="1634734477742" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2208" width="200" height="200"><path d="M569.508769 653.352619l151.594419 0 0 108.819221-151.594419 0L569.508769 653.352619zM569.508769 65.693452l385.479045 0 0 108.828814L569.508569 174.522266 569.508769 65.693452 569.508769 65.693452zM569.508769 261.583239l307.513506 0 0 108.819021L569.508769 370.402259 569.508769 261.583239 569.508769 261.583239zM569.508769 457.463032l229.552363 0 0 108.821019-229.552363 0C569.508769 566.284051 569.508769 457.463032 569.508769 457.463032zM569.508769 849.232612l73.62868 0 0 108.826815-73.62868 0L569.508769 849.232612zM354.693414 427.846912l0 530.212516L203.94622 958.059428 203.94622 427.846912 62.754748 427.846912 279.308125 65.187795 495.87849 427.846912 354.693414 427.846912z" p-id="2209"></path></svg>';
export const sortDown =
  '<svg t="1634734501800" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2875" width="200" height="200"><path d="M279.15323 958.059228l217.110799-363.160177-141.539436 0L354.724593 63.957829l-151.123938 0 0 530.943021L62.057421 594.900849 279.15323 958.059228 279.15323 958.059228zM570.078783 64.464885l386.443791 0 0 108.976114L570.078583 173.440999 570.078783 64.464885 570.078783 64.464885zM570.078783 369.594007 878.364965 369.594007l0-108.974515L570.078783 260.619492 570.078783 369.594007zM570.078783 565.747016l230.128573 0 0-108.976114L570.078783 456.770901 570.078783 565.747016 570.078783 565.747016zM570.078783 761.904621l151.972163 0L722.050945 652.930305l-151.972163 0L570.078783 761.904621zM570.078783 958.059228l73.813355 0 0-108.974315-73.813355 0L570.078783 958.059228z" p-id="2876"></path></svg>';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const App = ({ data }) => {
  const onIconClick = ({ meta }) => {
    setColModalVisible(!colModalVisible);
  };
  const [options, setOptions] = useState<S2Options>({
    width: 600,
    height: 400,
    showSeriesNumber: true,
    colCell: (item, spreadsheet, headerConfig) => {
      let cell;
      if (item.colIndex === 0) {
        cell = new TableCornerCell(item, spreadsheet, headerConfig);
      } else {
        cell = new CustomTableColCell(
          item,
          spreadsheet,
          headerConfig,
          onIconClick,
        );
      }
      return cell;
    },
    customSVGIcons: [
      {
        name: 'Filter',
        svg: filterIcon,
      },
      {
        name: 'SortUp',
        svg: sortUp,
      },
      {
        name: 'SortDown',
        svg: sortDown,
      },
    ],
    showDefaultHeaderActionIcon: false,
  });
  const [dataCfg, setDataCfg] = useState<S2DataConfig>({
    fields: {
      columns: ['province', 'city', 'type', 'price'],
    },
    data,
    sortParams: [],
    filterParams: [],
  });

  const [searchKey, setSearchKey] = useState('');
  const [colModalVisible, setColModalVisible] = useState(false);
  const [colModalMeta, setColModalMeta] = useState(null);
  const [form] = Form.useForm();

  return (
    <div>
      <Space>
        <Search
          placeholder="输入关键词搜索"
          allowClear
          enterButton="Search"
          value={searchKey}
          onSearch={() => {}}
        />
        <Button shape="circle" icon={<antdIcons.ArrowLeftOutlined />} />
        <Button shape="circle" icon={<antdIcons.ArrowRightOutlined />} />
      </Space>
      <Divider />
      <SheetComponent dataCfg={dataCfg} options={options} sheetType="table" />
      <Modal
        title="列设置"
        visible={colModalVisible}
        onCancel={() => {
          setColModalVisible(false);
          form.resetFields();
        }}
        onOk={() => {}}
      >
        <Form {...layout} form={form} name="control-hooks">
          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true }]}
            initialValue="NONE"
          >
            <Radio.Group>
              <Radio value={'NONE'}>无</Radio>
              <Radio value={'ASC'}>升序</Radio>
              <Radio value={'DESC'}>降序</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((res) => {
    ReactDOM.render(<App data={res} />, document.getElementById('container'));
  });
