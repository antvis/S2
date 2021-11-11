import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Input, Select, Space, Switch } from 'antd';
import { isArray, merge, mergeWith } from 'lodash';
import {
  DEFAULT_OPTIONS,
  S2DataConfig,
  S2Options,
  SpreadSheet,
  ThemeCfg,
  TargetCellInfo,
  DEFAULT_DATA_CONFIG,
} from '@antv/s2';
import { data, totalData, meta } from '../data/mock-dataset.json';
import 'antd/dist/antd.min.css';
import { SheetComponent, SheetType } from '@/components/index';

export const assembleOptions = (...options: Partial<S2Options>[]) =>
  mergeWith(
    {},
    DEFAULT_OPTIONS,
    { debug: true, width: 1000, height: 600 },
    ...options,
    (origin, updated) => {
      if (isArray(origin) && isArray(updated)) {
        return updated;
      }
    },
  );

export const assembleDataCfg = (...dataCfg: Partial<S2DataConfig>[]) =>
  mergeWith(
    {},
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
    (origin, updated) => {
      if (isArray(origin) && isArray(updated)) {
        return updated;
      }
    },
  );

interface SheetEntryProps {
  options: Partial<S2Options>;
  dataCfg: Partial<S2DataConfig>;
  forceUpdateDataCfg?: boolean; // 是否强制替换 dataCfg
  themeCfg?: ThemeCfg;
  header?: ReactNode;
  sheetType?: SheetType;
  onColCellClick?: (data: TargetCellInfo) => void;
}

// eslint-disable-next-line react/display-name
export const SheetEntry = forwardRef(
  (props: SheetEntryProps, ref: MutableRefObject<SpreadSheet>) => {
    const [mode, setMode] = useState('grid');
    const [valueInCols, setValueInCols] = useState(true);
    const initOptions = assembleOptions(props.options);

    const initDataCfg = props.forceUpdateDataCfg
      ? props.dataCfg
      : assembleDataCfg(props.dataCfg);
    const [adaptive, setAdaptive] = useState(false);
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
            checkedChildren="自适应开"
            unCheckedChildren="自适应关"
            defaultChecked={adaptive}
            onChange={(checked) => {
              setAdaptive(checked);
            }}
          />
          <Select
            defaultValue={options.tooltip.autoAdjustBoundary}
            onChange={onAutoAdjustBoundary}
          >
            <Select.Option value="container">
              container (表格区域)
            </Select.Option>
            <Select.Option value="body">body (浏览器可视区域)</Select.Option>
            <Select.Option value="">无</Select.Option>
          </Select>
          <Space>
            设置宽度 ：
            <Input
              style={{ width: 100 }}
              placeholder="宽度(px)"
              onChange={onSizeChange('width')}
              defaultValue={options.width}
              suffix="px"
            />
            设置高度 ：
            <Input
              style={{ width: 100 }}
              placeholder="高度(px)"
              onChange={onSizeChange('height')}
              defaultValue={options.height}
              suffix="px"
            />
          </Space>
        </Space>
        <div style={{ marginBottom: 20 }}>{props.header}</div>
        <SheetComponent
          dataCfg={dataCfg as S2DataConfig}
          options={options}
          sheetType={props.sheetType}
          adaptive={adaptive}
          getSpreadsheet={(instance) => {
            if (ref) {
              ref.current = instance;
            }
          }}
          themeCfg={props.themeCfg}
          onColCellClick={props.onColCellClick}
        />
      </div>
    );
  },
);
