import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { isEqual, isNil } from 'lodash';
import cx from 'classnames';
import React from 'react';
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
  contentTitleText?: string;
  resetText?: string;
  innerContentClassName?: string;
  onToggleVisible: () => void;
  onSubmit?: (result: SwitcherResult) => void;
}

export const SwitcherContent: React.FC<SwitcherContentProps> = ({
  innerContentClassName,
  contentTitleText,
  resetText,
  onToggleVisible,
  onSubmit,
  ...defaultFields
}) => {
  const defaultState = getSwitcherState(defaultFields);

  const [state, setState] = React.useState<SwitcherState>(defaultState);
  const [draggingItemId, setDraggingItemId] = React.useState<string>(null);

  const nonEmptyCount = getNonEmptyFieldCount(defaultFields);

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

  const onConfirm = () => {
    onToggleVisible();
    onSubmit?.(generateSwitchResult(state));
  };

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

  const isNothingChanged = isEqual(defaultState, state);
  return (
    <DragDropContext onBeforeCapture={onBeforeDragStart} onDragEnd={onDragEnd}>
      <div
        className={cx(
          innerContentClassName,
          getSwitcherClassName(CLASS_NAME_PREFIX),
        )}
      >
        <header className={getSwitcherClassName(CLASS_NAME_PREFIX, 'header')}>
          {contentTitleText}
        </header>
        <main
          className={cx(
            getSwitcherClassName(CLASS_NAME_PREFIX, 'main'),
            getMainLayoutClassName(nonEmptyCount),
          )}
        >
          {SWITCHER_FIELDS.map(
            (type) =>
              isNil(defaultFields[type]) || (
                <Dimension
                  {...defaultFields[type]}
                  key={type}
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
        <footer className={getSwitcherClassName(CLASS_NAME_PREFIX, 'footer')}>
          <Button
            type={'text'}
            icon={<ReloadOutlined />}
            className={getSwitcherClassName(
              CLASS_NAME_PREFIX,
              'footer',
              'reset-button',
            )}
            disabled={isNothingChanged}
            onClick={onReset}
          >
            {resetText}
          </Button>
          <div
            className={getSwitcherClassName(
              CLASS_NAME_PREFIX,
              'footer',
              'actions',
            )}
          >
            <Button className="action-button" onClick={onToggleVisible}>
              {i18n('取消')}
            </Button>
            <Button
              className="action-button"
              type="primary"
              disabled={isNothingChanged}
              onClick={onConfirm}
            >
              {i18n('确定')}
            </Button>
          </div>
        </footer>
      </div>
    </DragDropContext>
  );
};

SwitcherContent.displayName = 'SwitcherContent';

SwitcherContent.defaultProps = {
  contentTitleText: i18n('行列切换'),
  resetText: i18n('恢复默认'),
};
