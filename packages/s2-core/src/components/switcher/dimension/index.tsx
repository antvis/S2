import cx from 'classnames';
import React, { FC } from 'react';
import { FieldType, SWITCHER_CONFIG } from '../constant';
import {
  DimensionItem,
  DimensionItemType,
  MeasureItem,
  MeasureItemType,
} from '../item';
import './index.less';

interface DimensionProps {
  fieldType: FieldType;
  data: DimensionItemType[] | MeasureItemType[];
  crossRows?: boolean;
}

export const Dimension: FC<DimensionProps> = ({
  fieldType,
  data,
  crossRows,
}) => {
  const { text, icon: Icon } = SWITCHER_CONFIG[fieldType];
  const ItemComp = fieldType === FieldType.Value ? MeasureItem : DimensionItem;
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
        {data.map((item: DimensionItemType | MeasureItemType) => (
          <ItemComp key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

Dimension.defaultProps = {
  crossRows: false,
};
