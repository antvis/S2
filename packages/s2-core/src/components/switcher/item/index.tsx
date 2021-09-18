import Item from 'antd/lib/list/Item';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FieldType } from '../constant';
import { SwitcherItem } from '../interface';
import { getSwitcherClassName, isMeasureType } from '../util';
import './index.less';
import { SingleItem } from './single-item';

export interface DimensionCommonProps {
  fieldType: FieldType;
  expandChildren?: boolean;
  draggingItemId?: string;

  onVisibleItemChange?: (
    checked: boolean,
    fieldType: FieldType,
    id: string,
    parentId?: string,
  ) => void;
}

export type DimensionItemProps = DimensionCommonProps & {
  index: number;
  item: SwitcherItem;
};

export const DimensionItem: FC<DimensionItemProps> = ({
  fieldType,
  item: { id, displayName, checked = true, children = [] },
  expandChildren,
  index,
  draggingItemId,
  onVisibleItemChange,
}) => {
  const isMeasure = isMeasureType(fieldType);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cx(
            getSwitcherClassName(isMeasure ? 'measure-list' : 'dimension-list'),
            {
              'list-dragging': snapshot.isDragging,
            },
          )}
        >
          <SingleItem
            fieldType={fieldType}
            id={id}
            displayName={displayName}
            checked={checked}
            onVisibleItemChange={onVisibleItemChange}
            className={cx(isMeasure ? 'measure-item' : 'dimension-item', {
              'measure-collapse': !expandChildren,
            })}
          />

          {isMeasure && !isEmpty(children) && draggingItemId !== id && (
            <div
              className={cx('child-measures', {
                'measures-hidden': !expandChildren,
              })}
            >
              {children.map((item) => (
                <SingleItem
                  key={item.id}
                  id={item.id}
                  fieldType={fieldType}
                  displayName={item.displayName}
                  disabled={!checked}
                  checked={item.checked}
                  parentId={id}
                  onVisibleItemChange={onVisibleItemChange}
                  className="measure-item"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

DimensionItem.defaultProps = {
  expandChildren: false,
};
