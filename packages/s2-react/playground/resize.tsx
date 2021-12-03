import {
  customMerge,
  ResizeActiveOptions,
  S2Options,
  ThemeCfg,
} from '@antv/s2';
import { Checkbox, Switch } from 'antd';
import React, { FC } from 'react';

const RESIZE_CONFIG: Array<{
  label: string;
  value: keyof ResizeActiveOptions;
}> = [
  { label: '角头热区', value: 'enableCornerCellHorizontalResize' },
  { label: '行头热区', value: 'enableRowCellVerticalResize' },
  { label: '列头水平热区', value: 'enableColCellHorizontalResize' },
  { label: '列头垂直热区', value: 'enableColCellVerticalResize' },
];

export const ResizeConfig: FC<{
  setThemeCfg: (cb: (theme: ThemeCfg) => ThemeCfg) => void;
  setOptions: (cb: (prev: S2Options) => S2Options) => void;
}> = ({ setThemeCfg, setOptions }) => {
  const [showResizeArea, setShowResizeArea] = React.useState(false);

  const onShowResizeAreaChange = (enable: boolean) => {
    const theme = {
      resizeArea: {
        backgroundOpacity: enable ? 1 : 0,
      },
    };
    setShowResizeArea(enable);
    setThemeCfg((prev) => customMerge({}, prev, { theme }));
  };

  const onResizeActiveChange = (checkedAreas: string[]) => {
    const resizeActive = RESIZE_CONFIG.reduce((cfg, item) => {
      const type = item.value;
      cfg[type] = checkedAreas.includes(type);
      return cfg;
    }, {});

    const updatedOptions = {
      interaction: {
        resizeActive,
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
        defaultValue={[
          'enableCornerCellHorizontalResize',
          'enableRowCellVerticalResize',
          'enableColCellHorizontalResize',
          'enableColCellVerticalResize',
        ]}
        onChange={onResizeActiveChange}
      />
    </>
  );
};
