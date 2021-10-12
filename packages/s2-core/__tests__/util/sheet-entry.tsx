import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Checkbox, Switch } from 'antd';
import { isArray, merge, mergeWith } from 'lodash';
import { data, totalData, meta } from '../data/mock-dataset.json';
import {
  defaultDataConfig,
  defaultOptions,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  ThemeCfg,
  SheetType,
  TargetCellInfo,
} from '@/index';
import 'antd/dist/antd.min.css';

export const assembleOptions = (...options: Partial<S2Options>[]) =>
  mergeWith(
    {},
    defaultOptions,
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
    defaultDataConfig,
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
    const [freezeRowHeader, setFreezeRowHeader] = useState(true);
    const initOptions = assembleOptions(props.options);

    const initDataCfg = props.forceUpdateDataCfg
      ? props.dataCfg
      : assembleOptions(props.dataCfg);
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

    const onFreezeRowHeaderChange = (e) => {
      setFreezeRowHeader(e.target.checked);
      setOptions(
        merge({}, options, {
          freezeRowHeader: e.target.checked,
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
        <div style={{ marginBottom: 20 }}>
          <Switch
            checkedChildren="树形"
            unCheckedChildren="平铺"
            checked={mode === 'tree'}
            onChange={onModeChange}
            style={{ marginRight: 10 }}
          />
          <Switch
            checkedChildren="挂列头"
            unCheckedChildren="挂行头"
            defaultChecked={valueInCols}
            onChange={onValueInColsChange}
            style={{ marginRight: 10 }}
          />
          冻结行头：
          <Checkbox
            checked={freezeRowHeader}
            onChange={onFreezeRowHeaderChange}
          />
        </div>
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
