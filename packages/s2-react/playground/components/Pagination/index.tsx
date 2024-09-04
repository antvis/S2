import { i18n } from '@antv/s2';
import { Pagination } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import { usePagination } from '../../../src/hooks';
import { usePlaygroundContext } from '../../context/playground.context';
import './index.less';

interface PlaygroundSheetPaginationProps {}

const PRE_CLASS = `sheet-pagination`;

export const PlaygroundSheetPagination: React.FC<
  PlaygroundSheetPaginationProps
> = () => {
  const context = usePlaygroundContext();
  const sheetInstance = context.ref?.current!;
  const pagination = usePagination(sheetInstance);

  if (isEmpty(pagination)) {
    return null;
  }

  const { total, pageSize } = pagination;
  // 大于 5页时展示快速跳转
  const showQuickJumper = total! / pageSize > 5;

  return (
    <div className={PRE_CLASS}>
      <Pagination
        size="small"
        defaultCurrent={1}
        showSizeChanger
        showQuickJumper={showQuickJumper}
        {...pagination}
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

PlaygroundSheetPagination.displayName = 'PlaygroundSheetPagination';
