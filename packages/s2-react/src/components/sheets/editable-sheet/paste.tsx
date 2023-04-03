import { useEffect } from 'react';
import { CellTypes, SpreadSheet } from '@antv/s2';
import { useSpreadSheetRef } from '../../../utils/SpreadSheetContext';

const getDisplayRowMappedIndex = (
  rowIndex: number,
  spreadsheet: SpreadSheet,
) => {
  const data = spreadsheet.dataSet.getDisplayDataSet()[rowIndex];
  return spreadsheet.dataSet.originData.findIndex((val) => val === data);
};

/**
 * 粘贴值功能
 * @returns
 */
export const PastePlugin = () => {
  const spreadsheet = useSpreadSheetRef();

  useEffect(() => {
    const handlePaste = async () => {
      try {
        // 批量黏贴数据
        const meta = spreadsheet.interaction
          .getInteractedCells()
          .filter((cell) => cell.cellType === CellTypes.DATA_CELL)[0]
          .getMeta();

        const activeDom = document.activeElement;
        if (meta && activeDom?.tagName === 'BODY') {
          const { rowIndex, colIndex } = meta;
          const source = spreadsheet.dataSet.originData;
          const clipboardItems = await navigator.clipboard.read();
          const result = await clipboardItems[0]?.getType('text/html');
          const tableNode = await result.text();
          const $doc = new DOMParser().parseFromString(tableNode, 'text/html');
          const $trs = Array.from($doc.querySelectorAll('table tr'));
          const lines = $trs.map((tr) =>
            Array.from(tr.children).map((td) => td.textContent || ''),
          );
          const columns = spreadsheet.dataCfg.fields.columns;

          lines.forEach((line, idx) => {
            const originIndex = getDisplayRowMappedIndex(
              rowIndex + idx,
              spreadsheet,
            );
            // 当列不存在时，代表需要新增列
            if (originIndex === -1) {
              const addedRow = {};
              columns.slice(colIndex, line.length).forEach((col, indx) => {
                addedRow[col as string] = line[indx];
              });
              spreadsheet.dataSet.originData.push(addedRow);
            } else {
              line.forEach((val, colIdx) => {
                const sanitizedVal = (val || '').replace(/^"|"$/g, '');
                const originalColIdx = colIndex + colIdx;

                if (columns[originalColIdx]) {
                  source[originIndex][columns[originalColIdx] as string] =
                    sanitizedVal;
                }
              });
            }
          });

          spreadsheet.render();
        }
      } catch (error) {
        // console.info(error);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [spreadsheet]);

  return null;
};
