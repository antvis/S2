import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  BeforeCapture,
  DragDropContext,
  DropResult,
} from 'react-beautiful-dnd';
import { FieldType, SWITCHER_CONFIG, SWITCHER_FIELDS } from '../constant';
import { Dimension } from '../dimension';
import { SwitcherFields, SwitcherResult, SwitcherState } from '../interface';
import {
  checkItem,
  generateSwitchResult,
  getMainLayoutClassName,
  getNonEmptyFieldCount,
  getSwitcherClassName,
  getSwitcherState,
  moveItem,
  shouldCrossRows,
} from '../util';
import { i18n } from '@/common/i18n';
import './index.less';

const CLASS_NAME_PREFIX = 'content';
export interface SwitcherContentRef {
  getResult: () => SwitcherResult;
}

export interface SwitcherContentProps extends SwitcherFields {
  resetText?: string;
}

export const SwitcherContent = forwardRef(
  ({ resetText, ...defaultFields }: SwitcherContentProps, ref) => {
    const defaultState = getSwitcherState(defaultFields);

    const [state, setState] = useState<SwitcherState>(defaultState);
    const [draggingItemId, setDraggingItemId] = useState<string>(null);

    const nonEmptyCount = getNonEmptyFieldCount(defaultState);

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
      fieldType: FieldType,
      checked: boolean,
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
            {SWITCHER_FIELDS.map(
              (type) =>
                isEmpty(defaultState[type]) || (
                  <Dimension
                    {...defaultFields[type]}
                    fieldType={type}
                    items={state[type]}
                    crossRows={shouldCrossRows(nonEmptyCount, type)}
                    droppableType={SWITCHER_CONFIG[type].droppableType}
                    draggingItemId={draggingItemId}
                    onVisibleItemChange={onVisibleItemChange}
                  />
                ),
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
              {resetText ?? i18n('恢复默认')}
            </Button>
          </footer>
        </div>
      </DragDropContext>
    );
  },
);

SwitcherContent.displayName = 'SwitcherContent';

SwitcherContent.defaultProps = {
  resetText: i18n('恢复默认'),
};
