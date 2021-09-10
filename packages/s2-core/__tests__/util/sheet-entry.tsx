import {
  defaultDataConfig,
  defaultOptions,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  ThemeCfg,
} from '@/index';
import { Checkbox, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { isArray, merge, mergeWith } from 'lodash';
import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { data, meta, totalData } from '../data/mock-dataset.json';

export const assembleOptions = (...options: Partial<S2Options>[]) =>
  mergeWith(
    {},
    defaultOptions,
    { debug: true, width: 800, height: 600 },
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
        values: ['price'],
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
  header?: ReactNode;
  options: Partial<S2Options>;
  dataCfg: Partial<S2DataConfig>;
  themeCfg?: ThemeCfg;
}

// eslint-disable-next-line react/display-name
export const SheetEntry = forwardRef(
  (props: SheetEntryProps, ref: MutableRefObject<SpreadSheet>) => {
    const [mode, setMode] = useState('grid');
    const [valueInCols, setValueInCols] = useState(true);
    const [freezeRowHeader, setFreezeRowHeader] = useState(true);

    const [options, setOptions] = useState(() =>
      assembleOptions(props.options),
    );
    const [dataCfg, setDataCfg] = useState(() =>
      assembleDataCfg(props.dataCfg),
    );

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
      setFreezeRowHeader(checked);
      setOptions(
        merge({}, options, {
          freezeRowHeader: checked,
        }),
      );
    };

    useEffect(() => {
      setOptions(assembleOptions(options, props.options));
    }, [props.options]);

    useEffect(() => {
      setDataCfg(assembleDataCfg(dataCfg, props.dataCfg));
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
            value={freezeRowHeader}
            onChange={(e) => {
              onFreezeRowHeaderChange(e.target.checked);
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>{props.header}</div>
        <SheetComponent
          dataCfg={dataCfg}
          options={options}
          adaptive={false}
          getSpreadsheet={(instance) => {
            if (ref) {
              ref.current = instance;
            }
          }}
          themeCfg={props.themeCfg}
        />
      </div>
    );
  },
);
