import { Button } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { FieldType } from '../constant';
import { Dimension, DimensionItem, MeasureItem } from '../dimension/dimension';
import {
  getMainLayoutClassName,
  getNonEmptyFieldCount,
  showDimensionCrossRows,
} from '../util';
import './content.less';

export interface SwitcherProps {
  rows?: DimensionItem[];
  cols?: DimensionItem[];
  values?: MeasureItem[];
  onSubmit?: () => void;
}

export const SwitcherContent: FC<SwitcherProps> = ({ rows, cols, values }) => {
  const nonEmptyCount = getNonEmptyFieldCount(rows, cols, values);

  return (
    <div className="s2-switcher-content">
      <header>行列切换</header>
      <main className={getMainLayoutClassName(nonEmptyCount)}>
        {isEmpty(rows) || (
          <Dimension
            fieldType={FieldType.Row}
            data={rows}
            crossRows={showDimensionCrossRows(nonEmptyCount)}
          />
        )}
        {isEmpty(cols) || (
          <Dimension
            fieldType={FieldType.Col}
            data={cols}
            crossRows={showDimensionCrossRows(nonEmptyCount)}
          />
        )}
        {isEmpty(values) || (
          <Dimension
            fieldType={FieldType.Value}
            data={values}
            crossRows={true}
          />
        )}
      </main>
      <footer>
        <Button> 恢复默认</Button>
      </footer>
    </div>
  );
};

SwitcherContent.defaultProps = {
  rows: [],
  cols: [],
  values: [],
};
