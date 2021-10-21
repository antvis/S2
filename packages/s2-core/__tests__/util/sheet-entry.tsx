import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Input, Space, Switch } from 'antd';
import { isArray, merge, mergeWith } from 'lodash';
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
} from '@/index';
import 'antd/dist/antd.min.css';

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
    const [options, setOptions] = useState(() => initOptions);
    const [dataCfg, setDataCfg] = useState(() => initDataCfg);

    const onValueInColsChange = (checked) => {
      setValueInCols(checked);
      setDataCfg(
        merge({}, dataCfg, {
          fields: {
            valueInCols: checked,
          },
        }),
      );
    };

    const onModeChange = (checked) => {
      setMode(checked ? 'tree' : 'grid');
      setOptions(
        merge({}, options, {
          hierarchyType: checked ? 'tree' : 'grid',
        }),
      );
    };

    const onFreezeRowHeaderChange = (checked) => {
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
          dataCfg={dataCfg}
          options={options}
          sheetType={props.sheetType}
          adaptive={false}
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
