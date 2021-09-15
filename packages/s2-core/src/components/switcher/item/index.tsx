import { Checkbox } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import './index.less';

export interface DimensionItemType {
  id: string;
  displayName: string;
}

export type DimensionItemProps = DimensionItemType;

export const DimensionItem: FC<DimensionItemProps> = ({ displayName }) => {
  return <div className="s2-switcher-item dimension-item">{displayName}</div>;
};

export interface MeasureItemType extends DimensionItemType {
  checked?: boolean;
  derivedValues?: MeasureItemType[];
}
export type MeasureItemProps = MeasureItemType;
export const MeasureItem: FC<MeasureItemProps> = ({
  displayName,
  checked,
  derivedValues,
}) => {
  return (
    <div className="measure-items">
      <div className="s2-switcher-item measure-item">
        <Checkbox value={checked} />
        <span>{displayName}</span>
      </div>
      {isEmpty(derivedValues) || (
        <div className="derived-measures">
          {derivedValues.map((item) => (
            <div key={item.id} className="s2-switcher-item measure-item">
              <Checkbox value={item.checked} />
              <span>{item.displayName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MeasureItem.defaultProps = {
  checked: false,
  derivedValues: [],
};
