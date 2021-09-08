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
import {
  defaultDataConfig,
  defaultOptions,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  ThemeCfg,
} from '../../src';
import { data, meta } from '../data/mock-dataset.json';

const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
  },
  meta: [
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '商品类型',
    },
    {
      field: 'price',
      name: '价格',
    },
  ],
  data: [
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: '1',
    },
    {
      province: '浙江',
      city: '杭州',
      type: '纸张',
      price: '2',
    },
    {
      province: '浙江',
      city: '舟山',
      type: '笔',
      price: '17',
    },
    {
      province: '浙江',
      city: '舟山',
      type: '纸张',
      price: '0.5',
    },
    {
      province: '吉林',
      city: '丹东',
      type: '笔',
      price: '8',
    },
    {
      province: '吉林',
      city: '白山',
      type: '笔',
      price: '9',
    },
    {
      province: '吉林',
      city: '丹东',
      type: ' 纸张',
      price: '3',
    },
    {
      province: '吉林',
      city: '白山',
      type: '纸张',
      price: '1',
    },
  ],
};

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
  s2DataConfig;

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
