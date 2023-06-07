import { map } from 'lodash';
import type { DataItem, Node } from '@antv/s2';
import type { GetDataCellValueType } from '@antv/s2/src/utils/export/copy/pivot-data-cell-copy';
import { getColNodeFieldFromNode } from '@antv/s2/src/utils/export/method';
import { getFormatter } from '@antv/s2/src/utils/export/copy/common';

const VALUE_FIELD = '$$value$$';

// eslint-disable-next-line no-restricted-globals
self.addEventListener(
  'message',
  (event: MessageEvent<GetDataCellValueType>) => {
    const message = event.data;

    // eslint-disable-next-line no-console
    console.log('Worker received message:2222', message);
    const {
      leafRowNodes,
      leafColNodes,
      compatibleHideMeasureColumn,
      isPivotMode,
      dataSet,
    } = message;
    const getDataCellValue = (rowNode: Node, colNode: Node): DataItem => {
      const measureQuery = compatibleHideMeasureColumn;

      const cellData = dataSet.getCellData({
        query: {
          ...rowNode.query,
          ...colNode.query,
          ...measureQuery,
        },
        rowNode,
        isTotals:
          rowNode.isTotals ||
          rowNode.isTotalMeasure ||
          colNode.isTotals ||
          colNode.isTotalMeasure,
      });

      const field = getColNodeFieldFromNode(isPivotMode, colNode);

      const formatter = getFormatter(field ?? colNode.field, true, dataSet);

      return formatter(cellData?.[VALUE_FIELD] ?? '');
    };
    const getDataMatrixByHeaderNode = () =>
      map(leafRowNodes, (rowNode) =>
        leafColNodes.map((colNode) => {
          // console.log(rowNode, colNode, 'rowNode');
          return getDataCellValue(rowNode, colNode);
        }),
      );

    // eslint-disable-next-line no-console
    console.info(getDataMatrixByHeaderNode(), 'getDataMatrixByHeaderNode');

    // console.log('Worker received message:3333', leafRowNodes, leafColNodes);
    // eslint-disable-next-line no-restricted-globals
    self.postMessage(`Hello from Worker! Your message was3333: ${message}`);
  },
);
