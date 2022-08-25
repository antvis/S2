import React from 'react';
import { Pagination as AntdPagination } from 'antd';
import { isEmpty } from 'lodash';
import { i18n, S2_PREFIX_CLS } from '@antv/s2';
import type { SheetComponentsProps } from '../sheets/interface';

export interface S2PaginationProps {
  pagination: SheetComponentsProps['options']['pagination'];
  current: number;
  total: number;
  pageSize?: number;
  setCurrent?: (current: number) => void;
  setPageSize?: (pageSize: number) => void;
  onShowSizeChange?: (pageSize: number) => void;
  onChange?: (current: number) => void;
}

const PRE_CLASS = `${S2_PREFIX_CLS}-pagination`;

export const S2Pagination: React.FC<S2PaginationProps> = ({
  pagination,
  current,
  total,
  pageSize,
  setCurrent,
  setPageSize = () => {},
  onShowSizeChange = () => {},
  onChange = () => {},
}) => {
  // not show the pagination
  if (isEmpty(pagination)) {
    return null;
  }

  // only show the pagination when the pageSize > 5
  const showQuickJumper = total / pageSize > 5;

  return (
    <div className={PRE_CLASS}>
      <AntdPagination
        defaultCurrent={1}
        current={current}
        total={total}
        pageSize={pageSize}
        showSizeChanger
        size="small"
        showQuickJumper={showQuickJumper}
        {...pagination}
        onShowSizeChange={(current, size) => {
          onShowSizeChange(size);
          setPageSize(size);
          pagination.onShowSizeChange?.(current, size);
        }}
        onChange={(page, pageSize) => {
          onChange(page);
          setCurrent(page);
          pagination.onChange?.(page, pageSize);
        }}
      />
      <span
        className={`${PRE_CLASS}-count`}
        title={`${i18n('共计')}${total}${i18n('条')}`}
      >
        {i18n('共计')}
        {total || ' - '}
        {i18n('条')}
      </span>
    </div>
  );
};

S2Pagination.displayName = 'S2Pagination';
