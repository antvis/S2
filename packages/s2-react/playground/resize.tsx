import {
  customMerge,
  ResizeActiveOptions,
  S2Options,
  ThemeCfg,
  ResizeType,
} from '@antv/s2';
import { Checkbox, Switch } from 'antd';
import React, { FC } from 'react';

const RESIZE_CONFIG: Array<{
  label: string;
  value: keyof ResizeActiveOptions;
}> = [
  { label: '角头热区', value: 'cornerCellHorizontal' },
  { label: '行头热区', value: 'rowCellVertical' },
  { label: '列头水平方向resize热区', value: 'colCellHorizontal' },
  { label: '列头垂直方向resize热区', value: 'colCellVertical' },
];

export const ResizeConfig: FC<{
  setThemeCfg: (cb: (theme: ThemeCfg) => ThemeCfg) => void;
  setOptions: (cb: (prev: S2Options) => S2Options) => void;
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

  const onSwitchRowReisizeType = (enable: boolean) => {
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

  const onResizeActiveChange = (checkedAreas: string[]) => {
    const resize = RESIZE_CONFIG.reduce((cfg, item) => {
      const type = item.value;
      cfg[type] = checkedAreas.includes(type);
      return cfg;
    }, {});

    const updatedOptions = {
      interaction: {
        resize,
      },
    } as S2Options;

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
        onChange={onSwitchRowReisizeType}
      />
    </>
  );
};
