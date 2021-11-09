/* eslint-disable no-console */
import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Input, Select, Slider, Space, Switch, Tooltip } from 'antd';
import { merge } from 'lodash';
import { data, totalData, meta } from '../data/mock-dataset.json';
import {
  DEFAULT_OPTIONS,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  ThemeCfg,
  SheetType,
  TargetCellInfo,
  DEFAULT_DATA_CONFIG,
  S2Event,
} from '@/index';
import 'antd/dist/antd.min.css';
import { customMerge } from '@/utils/merge';

export const assembleOptions = (...options: Partial<S2Options>[]): S2Options =>
  customMerge(
    DEFAULT_OPTIONS,
    { debug: true, width: 1000, height: 600 },
    ...options,
  );

export const assembleDataCfg = (...dataCfg: Partial<S2DataConfig>[]) =>
  customMerge(
    DEFAULT_DATA_CONFIG,
    {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
        valueInCols: true,
      },
      meta,
      data,
      totalData,
    },
    ...dataCfg,
  );

interface SheetEntryProps {
  options: Partial<S2Options>;
  dataCfg: Partial<S2DataConfig>;
  forceUpdateDataCfg?: boolean; // 是否强制替换 dataCfg
  themeCfg?: ThemeCfg;
  header?: ReactNode;
  sheetType?: SheetType;
  onColCellClick?: (data: TargetCellInfo) => void;
  getSpreadSheet?: (instance: SpreadSheet) => void;
}

export const SheetEntry = forwardRef(
  (props: SheetEntryProps, ref: MutableRefObject<SpreadSheet>) => {
    const { themeCfg = {} } = props;
    const [mode, setMode] = useState('grid');
    const [valueInCols, setValueInCols] = useState(true);
    const initOptions = assembleOptions(props.options);
    const s2Ref = React.useRef<SpreadSheet>();

    const initDataCfg = props.forceUpdateDataCfg
      ? props.dataCfg
      : assembleDataCfg(props.dataCfg);
    const [adaptive, setAdaptive] = useState(false);
    const [showResizeArea, setShowResizeArea] = useState(false);
    const [options, setOptions] = useState<S2Options>(() => initOptions);
    const [dataCfg, setDataCfg] = useState<Partial<S2DataConfig>>(
      () => initDataCfg,
    );

    const onValueInColsChange = (checked: boolean) => {
      setValueInCols(checked);
      setDataCfg(
        merge({}, dataCfg, {
          fields: {
            valueInCols: checked,
          },
        }),
      );
    };

    const onAutoAdjustBoundary = (value: string) => {
      setOptions(
        merge({}, options, {
          tooltip: {
            autoAdjustBoundary: value || null,
          },
        }),
      );
    };

    const onModeChange = (checked: boolean) => {
      setMode(checked ? 'tree' : 'grid');
      setOptions(
        merge({}, options, {
          hierarchyType: checked ? 'tree' : 'grid',
        }),
      );
    };

    const onFreezeRowHeaderChange = (checked: boolean) => {
      setOptions(
        merge({}, options, {
          freezeRowHeader: checked,
        }),
      );
    };

    const onSizeChange = (type: 'width' | 'height') => (e) => {
      setOptions(
        merge({}, options, {
          [type]: e.target.value,
        }),
      );
    };

    const onAutoResetSheetStyleChange = (checked: boolean) => {
      setOptions(
        merge({}, options, {
          interaction: {
            autoResetSheetStyle: checked,
          },
        }),
      );
    };

    useEffect(() => {
      setOptions(assembleOptions(options, props.options));
    }, [props.options]);

    useEffect(() => {
      if (props.forceUpdateDataCfg) {
        setDataCfg(props.dataCfg);
      } else {
        setDataCfg(assembleDataCfg(dataCfg, props.dataCfg));
      }
    }, [props.dataCfg]);

    useEffect(() => {
      ref?.current?.on(S2Event.DATA_CELL_TREND_ICON_CLICK, () => {
        console.log('[forwardRef 方式] 趋势图icon点击');
      });
    }, [ref, props.sheetType]);

    useEffect(() => {
      s2Ref.current?.on(S2Event.DATA_CELL_TREND_ICON_CLICK, () => {
        console.log('[getSpreadSheet 回调方式] 趋势图icon点击');
      });
    }, [props.sheetType]);

    const sliderOptions = {
      min: 0,
      max: 10,
      step: 0.1,
      marks: {
        0.5: '0.5倍',
        1: '1 (默认)',
        2: '2倍',
        10: '10倍',
      },
    };

    const onScrollSpeedRatioChange =
      (type: 'horizontal' | 'vertical') => (value: number) => {
        setOptions(
          merge({}, options, {
            interaction: {
              scrollSpeedRatio: {
                [type]: value,
              },
            },
          }),
        );
      };

    return (
      <div>
        <Space style={{ marginBottom: 20 }}>
          <Switch
            checkedChildren="树形"
            unCheckedChildren="平铺"
            checked={mode === 'tree'}
            onChange={onModeChange}
          />
          <Switch
            checkedChildren="数值挂列头"
            unCheckedChildren="数值挂行头"
            defaultChecked={valueInCols}
            onChange={onValueInColsChange}
          />
          <Switch
            checkedChildren="冻结行头开"
            unCheckedChildren="冻结行头关"
            defaultChecked={options.freezeRowHeader}
            onChange={onFreezeRowHeaderChange}
          />
          <Switch
            checkedChildren="容器宽高自适应开"
            unCheckedChildren="容器宽高自适应关"
            defaultChecked={adaptive}
            onChange={(checked) => {
              setAdaptive(checked);
            }}
          />
          <Switch
            checkedChildren="resize热区开"
            unCheckedChildren="resize热区关"
            defaultChecked={showResizeArea}
            onChange={(checked) => {
              setShowResizeArea(checked);
            }}
          />
          <Tooltip title="开启后,点击空白处,按下ESC键, 取消高亮, 清空选中单元格, 等交互样式">
            <Switch
              checkedChildren="自动重置交互样式开"
              unCheckedChildren="自动重置交互样式关"
              defaultChecked={initOptions.interaction.autoResetSheetStyle}
              onChange={onAutoResetSheetStyleChange}
            />
          </Tooltip>
          <Space>
            <Tooltip title="显示的tooltip超过指定区域时自动调整, 使其不遮挡">
              tooltip 自动调整:
            </Tooltip>
            <Select
              defaultValue={options.tooltip.autoAdjustBoundary}
              onChange={onAutoAdjustBoundary}
              style={{ width: 180 }}
              size="small"
            >
              <Select.Option value="container">
                container (表格区域)
              </Select.Option>
              <Select.Option value="body">body (浏览器可视区域)</Select.Option>
              <Select.Option value="">无</Select.Option>
            </Select>
          </Space>
          <Space>
            设置宽度 ：
            <Input
              style={{ width: 100 }}
              placeholder="宽度(px)"
              onChange={onSizeChange('width')}
              defaultValue={options.width}
              suffix="px"
              size="small"
            />
            设置高度 ：
            <Input
              style={{ width: 100 }}
              placeholder="高度(px)"
              onChange={onSizeChange('height')}
              defaultValue={options.height}
              suffix="px"
              size="small"
            />
          </Space>
        </Space>
        <div style={{ marginBottom: 40, width: '70%' }}>
          水平滚动速率 ：
          <Slider
            {...sliderOptions}
            defaultValue={options.interaction.scrollSpeedRatio.horizontal}
            onChange={onScrollSpeedRatioChange('horizontal')}
          />
          垂直滚动速率 ：
          <Slider
            {...sliderOptions}
            defaultValue={options.interaction.scrollSpeedRatio.vertical}
            onChange={onScrollSpeedRatioChange('vertical')}
          />
        </div>
        <div style={{ marginBottom: 20 }}>{props.header}</div>
        <SheetComponent
          dataCfg={dataCfg as S2DataConfig}
          options={options}
          sheetType={props.sheetType}
          adaptive={adaptive}
          ref={ref}
          getSpreadSheet={(instance) => {
            s2Ref.current = instance;
          }}
          themeCfg={{
            ...themeCfg,
            theme: merge({}, themeCfg.theme, {
              resizeArea: {
                backgroundOpacity: showResizeArea ? 1 : 0,
              },
            }),
          }}
          onColCellClick={props.onColCellClick}
        />
      </div>
    );
  },
);

SheetEntry.displayName = 'SheetEntry';
