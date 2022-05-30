import cx from 'classnames';
import React, { FC, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Checkbox } from 'antd';
import { DroppableType, SWITCHER_CONFIG } from '../constant';
import { SwitcherField, SwitcherItem } from '../interface';
import { DimensionCommonProps, DimensionItem } from '../item';
import { getSwitcherClassName } from '../util';
import { i18n } from '@/common/i18n';
import './index.less';

const CLASS_NAME_PREFIX = 'dimension';
type DimensionProps = SwitcherField &
  DimensionCommonProps & {
    droppableType: DroppableType;
    crossRows?: boolean;
  };

export const Dimension: FC<DimensionProps> = ({
  fieldType,
  crossRows,
  expandable,
  expandText,
  allowEmpty,
  items,
  droppableType,
  ...rest
}) => {
  const [expandChildren, setExpandChildren] = useState(true);

  const onUpdateExpand = (event: CheckboxChangeEvent) => {
    setExpandChildren(event.target.checked);
  };

  // 开启不允许为空后，如果当前有且仅有一个item时，需要禁用拖动
  const isDragDisabled = !allowEmpty && items.length === 1;

  const { text, icon: Icon } = SWITCHER_CONFIG[fieldType];
  return (
    <div
      className={cx(getSwitcherClassName(CLASS_NAME_PREFIX), {
        'long-dimension': crossRows,
      })}
    >
      <div className={getSwitcherClassName(CLASS_NAME_PREFIX, 'header')}>
        <div className="title">
          <Icon /> <span>{text}</span>
        </div>
        {expandable && (
          <div className={'expand-option'}>
            <Checkbox checked={expandChildren} onChange={onUpdateExpand} />
            <span className="description">{expandText}</span>
          </div>
        )}
      </div>

      <Droppable droppableId={fieldType} type={droppableType}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cx(getSwitcherClassName(CLASS_NAME_PREFIX, 'items'), {
              [getSwitcherClassName(CLASS_NAME_PREFIX, 'items-highlight')]:
                snapshot.isDraggingOver,
              [getSwitcherClassName(CLASS_NAME_PREFIX, 'long-items')]:
                crossRows,
            })}
          >
            {items.map((item: SwitcherItem, index: number) => (
              <DimensionItem
                key={item.id}
                index={index}
                fieldType={fieldType}
                item={item}
                expandable={expandable}
                expandChildren={expandChildren}
                isDragDisabled={isDragDisabled}
                {...rest}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

Dimension.defaultProps = {
  allowEmpty: true,
  crossRows: false,
  expandable: false,
  expandText: i18n('展开子项'),
  selectable: false,
  items: [],
};
