import { CaretRightOutlined } from '@ant-design/icons';
import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import { Collapse } from 'antd';
import React from 'react';
import { SketchPicker } from 'react-color';
import { DEFAULT_THEME_COLOR_LIST } from '../../../../common';
import { ResetButton } from '../../../common/reset-button';
import { ColorBox } from '../color-box';
import { useHistoryColorList } from '../hooks/useHistoryColorList';
import './index.less';

interface ColorPickerPanelProps {
  color?: string;
  maxCustomColorCount?: number;
  onChange?: (color: string) => void;
}

const PRE_CLASS = `${S2_PREFIX_CLS}-color-picker-panel`;

export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = React.memo(
  (props) => {
    const { color, maxCustomColorCount, onChange } = props;
    const historyColorList = useHistoryColorList(color!, maxCustomColorCount);
    const [pickerColor, setPickerColor] = React.useState(
      color ?? DEFAULT_THEME_COLOR_LIST[0],
    );

    React.useEffect(() => {
      if (color) {
        setPickerColor(color);
      }
    }, [color]);

    return (
      <div className={PRE_CLASS}>
        <div className={`${PRE_CLASS}-header`}>
          <span className={`${PRE_CLASS}-header-title`}>
            {i18n('颜色编辑')}
          </span>
          <ResetButton
            onClick={() => {
              onChange?.(DEFAULT_THEME_COLOR_LIST[0]);
            }}
          />
        </div>

        {/* 默认色板 */}
        <div className={`${PRE_CLASS}-section`}>
          <div className={`${PRE_CLASS}-section-title`}>
            {i18n('推荐主题色')}
          </div>
          <div className={`${PRE_CLASS}-section-color-list`}>
            {DEFAULT_THEME_COLOR_LIST.map((clr) => {
              return (
                <ColorBox
                  color={clr}
                  key={clr}
                  onClick={() => {
                    onChange?.(clr);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* 最近使用 */}
        <div className={`${PRE_CLASS}-section`}>
          <div className={`${PRE_CLASS}-section-title`}>{i18n('最近使用')}</div>
          <div className={`${PRE_CLASS}-section-color-list`}>
            {historyColorList.map((clr) => {
              return (
                <ColorBox
                  color={clr}
                  key={clr}
                  onClick={() => {
                    onChange?.(clr);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* 自由色板 */}
        <Collapse
          className={`${PRE_CLASS}-collapse`}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : -90} />
          )}
        >
          <Collapse.Panel
            key="custom"
            header={
              <span className={`${PRE_CLASS}-collapse-title`}>
                {i18n('自定义')}
              </span>
            }
          >
            <SketchPicker
              className={`${PRE_CLASS}-sketch-picker`}
              width="100%"
              presetColors={[]}
              color={pickerColor}
              disableAlpha
              onChange={(res) => setPickerColor(res.hex)}
              onChangeComplete={(res) => {
                onChange?.(res.hex);
              }}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  },
);

ColorPickerPanel.displayName = 'ColorPickerPanel';
