import { S2Event, SpreadSheet, type Pagination } from '@antv/s2';
import type { LayoutPaginationParams } from '@antv/s2-shared';
import { useUpdateEffect } from 'ahooks';
import { isEmpty } from 'lodash';
import React from 'react';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

/**
 * s2-react 内部不消费, 提供给外部的自行实现的分页便捷组合使用
 */
export const usePagination = (
  s2: SpreadSheet,
): Pagination & {
  onShowSizeChange: (current: number, pageSize: number) => void;
  onChange: (current: number, pageSize: number) => void;
} => {
  const options = s2?.options || {};
  const defaultPagination = options?.pagination;
  const [pagination, setPagination] = React.useState({
    total: s2?.facet?.viewCellHeights.getTotalLength() || 0,
    current: defaultPagination?.current || DEFAULT_PAGE_NUMBER,
    pageSize: defaultPagination?.pageSize || DEFAULT_PAGE_SIZE,
  });

  const onShowSizeChange = (current: number, pageSize: number) => {
    setPagination({ ...pagination, current, pageSize });
  };

  const onChange = (current: number, pageSize: number) => {
    setPagination({ ...pagination, current, pageSize });
  };

  // sync state.pagination -> s2.pagination
  useUpdateEffect(() => {
    const render = async () => {
      if (!s2 || isEmpty(defaultPagination)) {
        return;
      }

      s2.updatePagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      await s2.render(false);
    };

    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, s2]);

  // sync props.pagination -> state.pagination
  useUpdateEffect(() => {
    setPagination({
      total: s2?.facet?.viewCellHeights.getTotalLength() || 0,
      current: defaultPagination?.current || DEFAULT_PAGE_NUMBER,
      pageSize: defaultPagination?.pageSize || DEFAULT_PAGE_SIZE,
    });
  }, [defaultPagination, s2]);

  // sync layout result total -> state.total
  useUpdateEffect(() => {
    if (!s2 || isEmpty(defaultPagination)) {
      return;
    }

    const totalUpdateCallback = (data: LayoutPaginationParams) => {
      setPagination((prev) => {
        return { ...prev, total: data.total };
      });
    };

    s2.on(S2Event.LAYOUT_PAGINATION, totalUpdateCallback);

    return () => {
      s2.off(S2Event.LAYOUT_PAGINATION, totalUpdateCallback);
    };
  }, [defaultPagination, s2]);

  return {
    ...defaultPagination,
    ...pagination,
    onShowSizeChange,
    onChange,
  };
};
