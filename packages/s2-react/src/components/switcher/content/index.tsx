import { ReloadOutlined } from '@ant-design/icons';
import { i18n } from '@antv/s2';
import type { SheetType } from '@antv/s2-shared';
import { Button } from 'antd';
import cx from 'classnames';
import { isEqual } from 'lodash';
import React from 'react';
import {
  type BeforeCapture,
  DragDropContext,
  type DropResult,
} from 'react-beautiful-dnd';
import { FieldType, SWITCHER_FIELDS } from '../constant';
import { Dimension } from '../dimension';
import type {
  SwitcherFields,
  SwitcherResult,
  SwitcherState,
} from '../interface';
import {
  checkItem,
  generateSwitchResult,
  getMainLayoutClassName,
  getSwitcherClassName,
  getSwitcherConfig,
  getSwitcherState,
  moveItem,
  shouldCrossRows,
} from '../util';
import './index.less';

const CLASS_NAME_PREFIX = 'content';

export interface SwitcherContentProps extends SwitcherFields {
  sheetType?: SheetType;
  contentTitleText?: string;
  resetText?: string;
  innerContentClassName?: string;
  allowExchangeHeader?: boolean;
  onToggleVisible: () => void;
  onSubmit?: (result: SwitcherResult) => void;
}

export const SwitcherContent: React.FC<SwitcherContentProps> = React.memo(
  (props) => {
    const {
      innerContentClassName,
      contentTitleText = i18n('行列切换'),
      resetText = i18n('恢复默认'),
      allowExchangeHeader = true,
      onToggleVisible,
      onSubmit,
      sheetType,
      ...defaultFields
    } = props;

    const switcherConfig = getSwitcherConfig(allowExchangeHeader);
    const defaultState = getSwitcherState(defaultFields);

    const [state, setState] = React.useState<SwitcherState>(defaultState);
    const [draggingItemId, setDraggingItemId] = React.useState<string | null>(
      null,
    );
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
        // @ts-ignore
        state[source.droppableId],
        // @ts-ignore
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

    const displayFieldItems = SWITCHER_FIELDS.filter(
      (filed) => sheetType !== 'table' || filed === FieldType.Cols,
    );

    return (
      <DragDropContext
        onBeforeCapture={onBeforeDragStart}
        onDragEnd={onDragEnd}
      >
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
              getMainLayoutClassName(sheetType),
            )}
          >
            {displayFieldItems.map((type) => (
              <Dimension
                {...defaultFields[type]}
                key={type}
                fieldType={type}
                items={state[type]}
                crossRows={shouldCrossRows(sheetType, type)}
                draggingItemId={draggingItemId}
                onVisibleItemChange={onVisibleItemChange}
                {...switcherConfig[type]}
              />
            ))}
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
  },
);

SwitcherContent.displayName = 'SwitcherContent';
SwitcherContent.defaultProps = {
  sheetType: 'pivot',
};
