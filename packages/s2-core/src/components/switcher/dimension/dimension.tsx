import cx from 'classnames';
import React, { FC } from 'react';
import { FieldType, SWITCHER_CONFIG } from '../constant';
import './dimension.less';

export interface DimensionItem {
  id: string;
  displayName: string;
}

export interface MeasureItem extends DimensionItem {
  checked?: boolean;
  derivedValues?: MeasureItem[];
}

interface DimensionProps {
  fieldType: FieldType;
  data: DimensionItem[] | MeasureItem[];
  crossRows?: boolean;
}

export const Dimension: FC<DimensionProps> = ({
  fieldType,
  data,
  crossRows,
}) => {
  const { text, icon: Icon } = SWITCHER_CONFIG[fieldType];
  return (
    <div
      className={cx('s2-switcher-dimension', { 'long-dimension': crossRows })}
    >
      <div className="s2-switcher-dimension-header">
        <Icon /> <span>{text}</span>
      </div>

      <div
        className={cx('s2-switcher-dimension-items', {
          's2-switcher-dimension-long-items': crossRows,
        })}
      >
        {data.map((i) => (
          <div key={i.id}>{i.displayName}</div>
        ))}
      </div>
    </div>
  );
};

Dimension.defaultProps = {
  crossRows: false,
};
