import { CaretRightOutlined } from '@ant-design/icons';
import { S2_PREFIX_CLS, i18n } from '@antv/s2';
import { Collapse } from 'antd';
import React from 'react';
import { SketchPicker } from 'react-color';
import { DEFAULT_THEME_COLOR_LIST } from '../../../common';
import { ResetButton } from '../../common/reset-button';
import { ColorBox } from '../color-box';
import { useHistoryColorList } from '../hooks/useHistoryColorList';
import './index.less';
import type { ColorPickerPanelProps } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-color-picker-panel`;

/**
 * 自定义颜色选择面板
 */
export const ColorPickerPanel: React.FC<ColorPickerPanelProps> = React.memo(
  (props) => {
    const { primaryColor, maxHistoryColorCount, onChange } = props;
    const historyColorList = useHistoryColorList(
      primaryColor!,
      maxHistoryColorCount,
    );
    const [customPickerColor, setCustomPickerColor] = React.useState(
      primaryColor ?? DEFAULT_THEME_COLOR_LIST[0],
    );

    React.useEffect(() => {
      if (primaryColor) {
        setCustomPickerColor(primaryColor);
      }
    }, [primaryColor]);

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
            {DEFAULT_THEME_COLOR_LIST.map((color) => {
              return (
                <ColorBox
                  color={color}
                  key={color}
                  onClick={() => {
                    onChange?.(color);
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
            {historyColorList.map((color) => {
              return (
                <ColorBox
                  color={color}
                  key={color}
                  onClick={() => {
                    onChange?.(color);
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
              color={customPickerColor}
              disableAlpha
              onChange={({ hex }) => setCustomPickerColor(hex)}
              onChangeComplete={({ hex }) => {
                onChange?.(hex);
              }}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  },
);

ColorPickerPanel.displayName = 'ColorPickerPanel';
