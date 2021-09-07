import { Checkbox, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { merge } from 'lodash';
import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  defaultDataConfig,
  defaultOptions,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { data, meta } from '../data/mock-dataset.json';

export const assembleOptions = (...options: Partial<S2Options>[]) =>
  merge(
    {},
    defaultOptions,
    { debug: true, width: 800, height: 600 },
    ...options,
  );

export const assembleDataCfg = (...dataCfg: Partial<S2DataConfig>[]) =>
  merge(
    {},
    defaultDataConfig,
    {
      fields: {
        rows: ['area', 'province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['price', 'cost'],
      },
      meta,
      data,
    },
    ...dataCfg,
  );

interface SheetEntryProps {
  header?: ReactNode;
  options: Partial<S2Options>;
  dataCfg: Partial<S2DataConfig>;
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
          getSpreadsheet={(instance) => {
            if (ref) {
              ref.current = instance;
            }
          }}
        />
      </div>
    );
  },
);
