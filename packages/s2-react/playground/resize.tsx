import { customMerge, type ThemeCfg, ResizeType } from '@antv/s2';
import { Checkbox, Switch } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React from 'react';
import { SheetComponentOptions } from '../src/components';

const RESIZE_CONFIG: Array<{
  label: string;
  value: string;
}> = [
  { label: '角头热区', value: 'cornerCellHorizontal' },
  { label: '行头热区', value: 'rowCellVertical' },
  { label: '列头水平方向resize热区', value: 'colCellHorizontal' },
  { label: '列头垂直方向resize热区', value: 'colCellVertical' },
];

export const ResizeConfig: React.FC<{
  setThemeCfg: (cb: (theme: ThemeCfg) => ThemeCfg) => void;
  setOptions: (
    cb: (prev: SheetComponentOptions) => SheetComponentOptions,
  ) => void;
}> = ({ setThemeCfg, setOptions }) => {
  const [showResizeArea, setShowResizeArea] = React.useState(false);
  const [rowResizeAffectCurrent, setRowResizeAffectCurrent] =
    React.useState(false);

  const onShowResizeAreaChange = (enable: boolean) => {
    const theme = {
      resizeArea: {
        backgroundOpacity: enable ? 1 : 0,
      },
    };
    setShowResizeArea(enable);
    setThemeCfg((prev) => customMerge({}, prev, { theme }));
  };

  const onSwitchRowResizeType = (enable: boolean) => {
    const opts = {
      interaction: {
        resize: {
          rowResizeType: enable ? ResizeType.CURRENT : ResizeType.ALL,
        },
      },
    };
    setRowResizeAffectCurrent(enable);
    setOptions((prev) => customMerge({}, prev, opts));
  };

  const onResizeActiveChange = (checkedAreas: CheckboxValueType[]) => {
    const resize = RESIZE_CONFIG.reduce((cfg, item) => {
      const type = item.value;
      cfg[type] = checkedAreas.includes(type);
      return cfg;
    }, {});

    const updatedOptions: SheetComponentOptions = {
      interaction: {
        resize,
      },
    };

    setOptions((prev) => customMerge({}, prev, updatedOptions));
  };

  return (
    <>
      <Switch
        checkedChildren="宽高调整热区开"
        unCheckedChildren="宽高调整热区关"
        defaultChecked={showResizeArea}
        onChange={onShowResizeAreaChange}
      />
      <Checkbox.Group
        options={RESIZE_CONFIG}
        defaultValue={RESIZE_CONFIG.map((item) => item.value)}
        onChange={onResizeActiveChange}
      />
      <Switch
        checkedChildren="行高单行调整开"
        unCheckedChildren="行高单行调整关"
        defaultChecked={rowResizeAffectCurrent}
        onChange={onSwitchRowResizeType}
      />
    </>
  );
};
