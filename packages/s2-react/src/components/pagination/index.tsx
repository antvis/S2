import React from 'react';
import { Pagination as AntdPagination } from 'antd';
import { isEmpty } from 'lodash';
import { i18n, S2_PREFIX_CLS } from '@antv/s2';
import type { S2Options } from '@antv/s2';

export interface S2PaginationProps {
  pagination: S2Options['pagination'];
  onShowSizeChange?: (current: number, pageSize: number) => void;
  onChange?: (current: number, pageSize: number) => void;
}

const PRE_CLASS = `${S2_PREFIX_CLS}-pagination`;

export const S2Pagination: React.FC<S2PaginationProps> = ({
  pagination,
  onShowSizeChange,
  onChange,
}) => {
  // not show the pagination
  if (isEmpty(pagination)) {
    return null;
  }

  const { total, pageSize } = pagination;
  // only show the pagination when the pageSize > 5
  const showQuickJumper = total! / pageSize > 5;

  return (
    <div className={PRE_CLASS}>
      <AntdPagination
        size="small"
        defaultCurrent={1}
        showSizeChanger
        showQuickJumper={showQuickJumper}
        {...pagination}
        onShowSizeChange={onShowSizeChange}
        onChange={onChange}
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
