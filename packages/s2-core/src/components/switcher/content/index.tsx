import { Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { filter, flatten, isEmpty, map } from 'lodash';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { DragDropContext, DragStart, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { FieldType } from '../constant';
import { Dimension } from '../dimension';
import { Item } from '../item';
import {
  getMainLayoutClassName,
  getNonEmptyFieldCount,
  isMeasureType,
  showDimensionCrossRows,
} from '../util';
import './index.less';

export interface State {
  [FieldType.Rows]?: Item[];
  [FieldType.Cols]?: Item[];
  [FieldType.Values]?: Item[];
}

export interface Result {
  [FieldType.Rows]: string[];
  [FieldType.Cols]: string[];
  [FieldType.Values]: string[];
  hiddenValues: string[];
}

export interface SwitcherContentRef {
  getResult: () => Result;
}

export const SwitcherContent = forwardRef((props: State, ref) => {
  const [state, setState] = useState<State>(props);
  const [expandDerivedValues, setExpandDerivedValues] = useState(true);

  const nonEmptyCount = getNonEmptyFieldCount(
    state.rows,
    state.cols,
    state.values,
  );

  const onUpdateExpandDerivedValues = (event: CheckboxChangeEvent) => {
    setExpandDerivedValues(event.target.checked);
  };

  const onDragStart = (initial: DragStart) => {
    if (isMeasureType(initial.type as FieldType)) {
      setExpandDerivedValues(false);
    }
  };
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
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
    const updateState = [...state[destination.droppableId]];
    const targetField = updateState.find((item) => item.id === draggableId);

    updateState.splice(source.index, 1);
    updateState.splice(destination.index, 0, targetField);

    setState({ ...state, [destination.droppableId]: updateState });
  };
  const onReset = () => {
    setState(props);
  };

  useImperativeHandle(
    ref,
    () => ({
      getResult() {
        const rows = map(state[FieldType.Rows], 'id');
        const cols = map(state[FieldType.Cols], 'id');

        const values = flatten(
          map(state[FieldType.Values], (item) => {
            const derivedValues = map(item.derivedValues, 'id');
            return [item.id, ...derivedValues];
          }),
        );

        const hiddenValues = flatten(
          map(filter(state[FieldType.Values], ['checked', true]), (item) => {
            const derivedValues = map(
              filter(item.derivedValues, ['checked', true]),
              'id',
            );
            return [item.id, ...derivedValues];
          }),
        );

        return { rows, cols, values, hiddenValues };
      },
    }),
    [state],
  );
  const onVisibleItemChange = (
    checked: boolean,
    fieldType: FieldType,
    id: string,
    derivedId?: string,
  ) => {
    const targetField: Item = {
      ...state[fieldType].find((item) => item.id === id),
    };
    if (derivedId) {
      targetField.derivedValues = map(targetField.derivedValues, (item) => ({
        ...item,
        checked: item.id === derivedId ? checked : item.checked,
      }));
    } else {
      targetField.checked = checked;
      targetField.derivedValues = map(targetField.derivedValues, (item) => ({
        ...item,
        checked: checked,
      }));
    }

    const updateState = state[fieldType].map((item) =>
      item.id === targetField.id ? targetField : item,
    );

    setState({
      ...state,
      [fieldType]: updateState,
    });
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="s2-switcher-content">
        <header>行列切换</header>
        <main className={getMainLayoutClassName(nonEmptyCount)}>
          {isEmpty(state.rows) || (
            <Dimension
              fieldType={FieldType.Rows}
              data={state.rows}
              crossRows={showDimensionCrossRows(nonEmptyCount)}
            />
          )}
          {isEmpty(state.cols) || (
            <Dimension
              fieldType={FieldType.Cols}
              data={state.cols}
              crossRows={showDimensionCrossRows(nonEmptyCount)}
            />
          )}
          {isEmpty(state.values) || (
            <Dimension
              fieldType={FieldType.Values}
              data={state.values}
              crossRows={true}
              expandDerivedValues={expandDerivedValues}
              onVisibleItemChange={onVisibleItemChange}
              option={
                <div className="s2-switcher-option">
                  <Checkbox
                    checked={expandDerivedValues}
                    onChange={onUpdateExpandDerivedValues}
                  />
                  <span className="description">展开同环比</span>
                </div>
              }
            />
          )}
        </main>
        <footer>
          <Button
            type={'text'}
            icon={<ReloadOutlined />}
            className={'s2-switcher-reset-button'}
            onClick={onReset}
          >
            恢复默认
          </Button>
        </footer>
      </div>
    </DragDropContext>
  );
});

SwitcherContent.displayName = 'SwitcherContent';
SwitcherContent.defaultProps = {
  rows: [],
  cols: [],
  values: [],
};
