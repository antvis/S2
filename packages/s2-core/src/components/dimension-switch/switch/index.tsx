import React, { useState, FC } from 'react';
import { Button } from 'antd';
import { get, isEqual, reduce } from 'lodash';
import { Dimension, DimensionType } from '../dimension';
import { getDimensionsByPredicate, OperatedType } from '../util';
import { i18n } from '@/common/i18n';
import './index.less';

export interface DimensionSwitchProps {
  data: DimensionType[];
  keepSearching?: boolean;
  onUpdateDisableItems?: (type: string, checkedList: string[]) => string[];
  onSubmit: (result: DimensionType[]) => void;
}

export const DimensionSwitch: FC<DimensionSwitchProps> = ({
  data,
  keepSearching,
  onUpdateDisableItems,
  onSubmit: onOuterSubmit,
}) => {
  const [{ defaultChecked, defaultDisabled }] = useState(() => ({
    defaultChecked: getDimensionsByPredicate(data, (i) => i.checked),
    defaultDisabled: getDimensionsByPredicate(data, (i) => i.disabled),
  }));

  const [checkedTypeObj, setCheckedTypeObj] =
    useState<OperatedType>(defaultChecked);
  const [disabledTypeObj, setDisabledTypeObj] =
    useState<OperatedType>(defaultDisabled);

  const onSelect = (type: string, idList: string[], checked: boolean) => {
    const oldCheckedList = get(checkedTypeObj, type, []);
    let newCheckedList = checked
      ? oldCheckedList.concat(idList)
      : oldCheckedList.filter((i) => !idList.includes(i));

    const disabledList = onUpdateDisableItems?.(type, newCheckedList) ?? [];

    newCheckedList = newCheckedList.filter((i) => !disabledList.includes(i));

    setCheckedTypeObj({ ...checkedTypeObj, [type]: newCheckedList });
    setDisabledTypeObj({ ...disabledTypeObj, [type]: disabledList });
  };

  const assembleData = () => {
    return data
      .filter((d) => d.items.length > 0)
      .map((d) => {
        return {
          ...d,
          items: d.items.map((i) => ({
            ...i,
            checked: !!checkedTypeObj[d.type]?.includes(i.id),
            disabled: !!disabledTypeObj[d.type]?.includes(i.id),
          })),
        };
      });
  };

  const onSubmit = () => {
    const result = assembleData();
    onOuterSubmit(result);
  };

  const onReset = () => {
    setCheckedTypeObj(defaultChecked);
    setDisabledTypeObj(defaultDisabled);
  };

  const actual = assembleData();

  // 小于4个时，放在一行排列，否则每行两列
  const dimensionCount = actual.length;

  const disabledResetBtn = isEqual(defaultChecked, checkedTypeObj);
  const disabledSubmitBtn =
    disabledResetBtn ||
    reduce(checkedTypeObj, (sum, items) => sum + items.length, 0) === 0;

  return (
    <div className={'dimension-switch'}>
      <div
        className={'dimension-switch-body'}
        style={{
          gridTemplateColumns:
            dimensionCount < 4 ? `repeat(${dimensionCount},auto)` : 'auto auto',
        }}
      >
        {actual.map((i) => (
          <Dimension
            key={i.type}
            {...i}
            keepSearching={keepSearching}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className={'dimension-switch-footer'}>
        <Button ghost={true} disabled={disabledResetBtn} onClick={onReset}>
          {i18n('重置')}
        </Button>
        <Button type="primary" disabled={disabledSubmitBtn} onClick={onSubmit}>
          {i18n('确定')}
        </Button>
      </div>
    </div>
  );
};
