import cx from 'classnames';
import React, { FC, ReactNode } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { DroppableType, SWITCHER_CONFIG } from '../constant';
import { Item } from '../interface';
import { DimensionCommonProps, DimensionItem } from '../item';
import './index.less';

interface DimensionProps extends DimensionCommonProps {
  data: Item[];
  droppableType: DroppableType;
  crossRows?: boolean;
  option?: ReactNode;
}

export const Dimension: FC<DimensionProps> = ({
  data,
  fieldType,
  droppableType,
  crossRows,
  option,
  ...rest
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

      <Droppable droppableId={fieldType} type={droppableType}>
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
                {...item}
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
  crossRows: false,
};
