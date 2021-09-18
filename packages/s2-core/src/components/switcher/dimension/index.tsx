import cx from 'classnames';
import React, { FC, ReactNode } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { DroppableType, SWITCHER_CONFIG } from '../constant';
import { SwitcherItem } from '../interface';
import { DimensionCommonProps, DimensionItem } from '../item';
import { getSwitcherClassName } from '../util';
import './index.less';

const CLASS_NAME_PREFIX = 'dimension';
interface DimensionProps extends DimensionCommonProps {
  data: SwitcherItem[];
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
      className={cx(getSwitcherClassName(CLASS_NAME_PREFIX), {
        'long-dimension': crossRows,
      })}
    >
      <div className={getSwitcherClassName(CLASS_NAME_PREFIX, 'header')}>
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
            className={cx(getSwitcherClassName(CLASS_NAME_PREFIX, 'items'), {
              [getSwitcherClassName(CLASS_NAME_PREFIX, 'items-highlight')]:
                snapshot.isDraggingOver,
              [getSwitcherClassName(CLASS_NAME_PREFIX, 'long-items')]:
                crossRows,
            })}
          >
            {data.map((item: SwitcherItem, index: number) => (
              <DimensionItem
                key={item.id}
                index={index}
                fieldType={fieldType}
                item={item}
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
