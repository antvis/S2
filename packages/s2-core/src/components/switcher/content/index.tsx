import { ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  BeforeCapture,
  DragDropContext,
  DropResult,
} from 'react-beautiful-dnd';
import { DroppableType, FieldType } from '../constant';
import { Dimension } from '../dimension';
import { SwitchResult, SwitchState } from '../interface';
import {
  checkItem,
  generateSwitchResult,
  getMainLayoutClassName,
  getNonEmptyFieldCount,
  getSwitcherClassName,
  moveItem,
  showDimensionCrossRows,
} from '../util';
import { i18n } from '@/common/i18n';
import './index.less';

const CLASS_NAME_PREFIX = 'content';
export interface SwitcherContentRef {
  getResult: () => SwitchResult;
}

export interface SwitcherContentProps extends SwitchState {
  expandBtnText?: string;
  resetBtnText?: string;
}

export const SwitcherContent = forwardRef(
  (
    { expandBtnText, resetBtnText, ...defaultState }: SwitcherContentProps,
    ref,
  ) => {
    const [state, setState] = useState<SwitchState>(defaultState);
    const [expand, setExpand] = useState(true);
    const [draggingItemId, setDraggingItemId] = useState<string>();

    const nonEmptyCount = getNonEmptyFieldCount(defaultState);

    const onUpdateExpand = (event: CheckboxChangeEvent) => {
      setExpand(event.target.checked);
    };

    const onBeforeDragStart = (initial: BeforeCapture) => {
      setDraggingItemId(initial.draggableId);
    };

    const onDragEnd = ({ destination, source }: DropResult) => {
      // reset dragging item id
      setDraggingItemId(null);

      // cancelled or drop to where can't drop
      if (!destination) {
        return;
      }
      // don't change position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const updatedState = moveItem(
        state[source.droppableId],
        state[destination.droppableId],
        source,
        destination,
      );
      setState({ ...state, ...updatedState });
    };

    const onReset = () => {
      setState(defaultState);
    };

    useImperativeHandle(
      ref,
      () => ({
        getResult() {
          return generateSwitchResult(state);
        },
      }),
      [state],
    );

    const onVisibleItemChange = (
      checked: boolean,
      fieldType: FieldType,
      id: string,
      parentId?: string,
    ) => {
      const updatedState = checkItem(state[fieldType], checked, id, parentId);
      setState({
        ...state,
        [fieldType]: updatedState,
      });
    };

    return (
      <DragDropContext
        onBeforeCapture={onBeforeDragStart}
        onDragEnd={onDragEnd}
      >
        <div className={getSwitcherClassName(CLASS_NAME_PREFIX)}>
          <header className={getSwitcherClassName(CLASS_NAME_PREFIX, 'header')}>
            {i18n('行列切换')}
          </header>
          <main
            className={cx(
              getSwitcherClassName(CLASS_NAME_PREFIX, 'main'),
              getMainLayoutClassName(nonEmptyCount),
            )}
          >
            {[FieldType.Rows, FieldType.Cols].map(
              (type) =>
                isEmpty(defaultState[type]) || (
                  <Dimension
                    droppableType={DroppableType.Dimension}
                    fieldType={type}
                    data={state[type]}
                    crossRows={showDimensionCrossRows(nonEmptyCount)}
                  />
                ),
            )}

            {isEmpty(defaultState.values) || (
              <Dimension
                crossRows={true}
                droppableType={DroppableType.Measure}
                fieldType={FieldType.Values}
                data={state.values}
                draggingItemId={draggingItemId}
                expandChildren={expand}
                onVisibleItemChange={onVisibleItemChange}
                option={
                  <div
                    className={getSwitcherClassName(
                      CLASS_NAME_PREFIX,
                      'dimension-option',
                    )}
                  >
                    <Checkbox checked={expand} onChange={onUpdateExpand} />
                    <span className="description">
                      {expandBtnText ?? i18n('展开同环比')}
                    </span>
                  </div>
                }
              />
            )}
          </main>
          <footer>
            <Button
              type={'text'}
              icon={<ReloadOutlined />}
              className={getSwitcherClassName(
                CLASS_NAME_PREFIX,
                'reset-button',
              )}
              onClick={onReset}
            >
              {resetBtnText ?? i18n('恢复默认')}
            </Button>
          </footer>
        </div>
      </DragDropContext>
    );
  },
);

SwitcherContent.displayName = 'SwitcherContent';
SwitcherContent.defaultProps = {
  rows: [],
  cols: [],
  values: [],
};
