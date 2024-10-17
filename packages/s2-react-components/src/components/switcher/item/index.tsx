import cx from 'classnames';
import { isEmpty } from 'lodash';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { DimensionCommonProps, SwitcherItem } from '../interface';
import { getSwitcherClassName } from '../util';
import './index.less';
import { SingleItem } from './single-item';

export type DimensionItemProps = DimensionCommonProps & {
  index: number;
  item: SwitcherItem;
  expandChildren: boolean;
  isDragDisabled: boolean;
};

export const DimensionItem: React.FC<DimensionItemProps> = React.memo(
  ({
    fieldType,
    item: { id, displayName, checked = true, children = [] },
    expandable,
    expandChildren,
    isDragDisabled,
    selectable,
    index,
    draggingItemId,
    onVisibleItemChange,
  }) => (
    <Draggable draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={cx(
            getSwitcherClassName(selectable ? 'checkable-list' : 'normal-list'),
            {
              dragging: snapshot.isDragging,
              'disable-dragging': isDragDisabled,
            },
          )}
        >
          <SingleItem
            dragHandleProps={provided.dragHandleProps}
            fieldType={fieldType}
            id={id}
            displayName={displayName}
            checked={checked}
            onVisibleItemChange={onVisibleItemChange}
            selectable={selectable}
            className={cx(selectable ? 'checkable-item' : 'normal-item', {
              'item-collapse': !expandChildren,
            })}
          />

          {expandable &&
            expandChildren &&
            !isEmpty(children) &&
            draggingItemId !== id && (
              <div
                className={cx('child-items', {
                  'item-hidden': !expandChildren,
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
                    selectable={selectable}
                    onVisibleItemChange={onVisibleItemChange}
                    className="checkable-item"
                  />
                ))}
              </div>
            )}
        </div>
      )}
    </Draggable>
  ),
);

DimensionItem.displayName = 'DimensionItem';
