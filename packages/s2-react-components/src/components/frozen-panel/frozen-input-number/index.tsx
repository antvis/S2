import { S2_PREFIX_CLS } from '@antv/s2';
import { InputNumber } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import type { FrozenInputNumberProps } from './interface';

const PRE_CLASS = `${S2_PREFIX_CLS}-frozen-input-number`;

export const FrozenInputNumber: React.FC<FrozenInputNumberProps> = React.memo(
  (props) => {
    const { disabled, value, onChange, ...attrs } = props;
    const [inputValue, setInputValue] = React.useState<number | string | null>(
      value,
    );

    const onDebounceChange = React.useMemo(() => {
      return debounce((nextValue) => {
        onChange?.(nextValue);
      }, 500);
    }, []);

    React.useEffect(() => {
      if (value !== inputValue) {
        setInputValue(value);
      }

      return () => {
        onDebounceChange.cancel();
      };
    }, [value]);

    return (
      <InputNumber
        className={PRE_CLASS}
        size="small"
        min={0}
        max={20}
        step={1}
        precision={0}
        disabled={disabled}
        {...attrs}
        value={inputValue}
        onChange={(nextValue) => {
          setInputValue(nextValue);
          onDebounceChange(nextValue);
        }}
      />
    );
  },
);

FrozenInputNumber.displayName = 'FrozenInputNumber';
