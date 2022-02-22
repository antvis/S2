import React from 'react';
import { S2Event, SpreadSheet } from '@antv/s2';
import { useLatest } from 'ahooks';
import { isEmpty } from 'lodash';
import { BaseSheetComponentProps } from '../components';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

export const usePagination = (
  s2: SpreadSheet,
  props: BaseSheetComponentProps,
) => {
  const { options } = props;
  const [total, setTotal] = React.useState<number>(
    s2?.facet?.viewCellHeights.getTotalLength() ?? 0,
  );
  const paginationRef = useLatest(options.pagination);
  const [current, setCurrent] = React.useState<number>(
    options.pagination?.current || DEFAULT_PAGE_NUMBER,
  );
  const [pageSize, setPageSize] = React.useState<number>(
    options.pagination?.pageSize || DEFAULT_PAGE_SIZE,
  );

  // sync state.pagination -> s2.pagination
  React.useEffect(() => {
    if (!s2 || isEmpty(paginationRef.current)) {
      return;
    }

    s2.setOptions({
      pagination: {
        current,
        pageSize,
      },
    });
    s2.render(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, current, s2]);

  // sync props.pagination -> state.pagination
  React.useEffect(() => {
    setCurrent(options?.pagination?.current || DEFAULT_PAGE_NUMBER);
    setPageSize(options?.pagination?.pageSize || DEFAULT_PAGE_SIZE);
  }, [options.pagination]);

  // sync layout result total -> state.total
  React.useEffect(() => {
    if (!s2 || isEmpty(paginationRef.current)) {
      return;
    }

    const totalUpdateCallback = (data) => setTotal(data.total);
    s2.on(S2Event.LAYOUT_PAGINATION, totalUpdateCallback);
    return () => {
      s2.off(S2Event.LAYOUT_PAGINATION, totalUpdateCallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s2]);

  return {
    total,
    current,
    pageSize,
    setTotal,
    setCurrent,
    setPageSize,
  };
};
