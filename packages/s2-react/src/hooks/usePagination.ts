import React from 'react';
import { SpreadSheet } from '@antv/s2';
import { isEmpty } from 'lodash';
import { BaseSheetComponentProps } from '../components';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

export const usePagination = (
  s2: SpreadSheet,
  props: BaseSheetComponentProps,
) => {
  const { options } = props;
  const [total, setTotal] = React.useState<number>(0);
  const [current, setCurrent] = React.useState<number>(
    options.pagination?.current || DEFAULT_PAGE_NUMBER,
  );
  const [pageSize, setPageSize] = React.useState<number>(
    options.pagination?.pageSize || DEFAULT_PAGE_SIZE,
  );

  React.useEffect(() => {
    if (isEmpty(options.pagination)) {
      return;
    }
    s2.setOptions({
      pagination: {
        current,
        pageSize,
      },
    });
    s2.render(false);
  }, [pageSize, current, options.pagination, s2]);

  React.useEffect(() => {
    setCurrent(options?.pagination?.current || DEFAULT_PAGE_NUMBER);
    setPageSize(options?.pagination?.pageSize || DEFAULT_PAGE_SIZE);
  }, [options.pagination]);

  return {
    total,
    current,
    pageSize,
    setTotal,
    setCurrent,
    setPageSize,
  };
};
