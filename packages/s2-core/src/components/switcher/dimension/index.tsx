import cx from 'classnames';
import React, { FC, ReactNode } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { FieldType, SWITCHER_CONFIG } from '../constant';
import { DimensionItem, Item } from '../item';
import './index.less';

interface DimensionProps {
  fieldType: FieldType;
  data: Item[];
  crossRows?: boolean;
  option?: ReactNode;
  expandDerivedValues?: boolean;
  onVisibleItemChange?: (
    checked: boolean,
    fieldType: FieldType,
    id: string,
    derivedId?: string,
  ) => void;
}

export const Dimension: FC<DimensionProps> = ({
  fieldType,
  data,
  expandDerivedValues,
  onVisibleItemChange,
  crossRows,
  option,
}) => {
  const { text, icon: Icon } = SWITCHER_CONFIG[fieldType];
  return (
    <div
      className={cx('s2-switcher-dimension', {
        'long-dimension': crossRows,
      })}
    >
      <div className="s2-switcher-dimension-header">
        <div className="title">
          <Icon /> <span>{text}</span>
        </div>
        {option}
      </div>

      <Droppable droppableId={fieldType} type={fieldType}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cx('s2-switcher-dimension-items', {
              's2-switcher-dimension-items-highlight': snapshot.isDraggingOver,
              's2-switcher-dimension-long-items': crossRows,
            })}
          >
            {data.map((item: Item, index: number) => (
              <DimensionItem
                key={item.id}
                index={index}
                fieldType={fieldType}
                expandDerivedValues={expandDerivedValues}
                onVisibleItemChange={onVisibleItemChange}
                {...item}
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
  crossRows: false,
};
