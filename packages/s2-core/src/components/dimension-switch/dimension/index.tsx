import { i18n } from '@/common/i18n';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Tooltip } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import './index.less';

export interface DimensionItem {
  id: string;
  displayName: string;
  checked: boolean;
  disabled?: boolean;
}

export interface DimensionType {
  type: string;
  displayName: string;
  items: DimensionItem[];
}

interface DimensionProps extends DimensionType {
  keepSearching?: boolean;
  onSelect: (type: string, idList: string[], checked: boolean) => void;
}

const Dimension: FC<DimensionProps> = ({
  type,
  displayName,
  items,
  keepSearching = false,
  onSelect,
}) => {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>();

  const [searching, setSearching] = useState(keepSearching);
  const [filterChecked, setFilterChecked] = useState(false);
  const [keyword, setKeyword] = useState('');

  const checkedList = items.filter((i) => i.checked).map((i) => i.id);

  // eslint-disable-next-line no-nested-ternary
  const filterResult = filterChecked
    ? items.filter((i) => i.checked)
    : keyword
    ? items.filter((i) => new RegExp(keyword, 'i').test(i.displayName))
    : items;

  const filterCheckedCount = filterResult.filter((i) => i.checked).length;

  const indeterminate =
    filterCheckedCount > 0 && filterCheckedCount < filterResult.length;
  const checkedAll =
    filterResult.length > 0 && filterCheckedCount === filterResult.length;

  const onShowSearchInput = () => {
    setSearching(true);
    setFilterChecked(false);

    const onHideSearchingInput = (event) => {
      const target: HTMLElement = event.target;
      // 排除items区域，所有 checkbox 及其 label 文字的点击
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'LABEL' ||
        (target.tagName === 'SPAN' &&
          target.parentElement.tagName === 'LABEL') ||
        target.className.startsWith('dimension-item')
      ) {
        return;
      }

      setSearching(false);
      setKeyword('');

      document.removeEventListener('click', onHideSearchingInput);
    };

    document.addEventListener('click', onHideSearchingInput);
  };

  const onUpdateCheckItem = (itemId: string, checked: boolean) => {
    onSelect(type, [itemId], checked);
  };

  const onUpdateCheckedAll = (checked: boolean) => {
    onSelect(
      type,
      filterResult.map((i) => i.id),
      checked,
    );
  };

  const onFilterAllChecked = () => {
    setFilterChecked(true);
    setKeyword('');
    if (!keepSearching) {
      setSearching(false);
    }
  };
  useEffect(() => {
    setHeight(ref.current.offsetHeight);
  }, []);

  return (
    <div
      className={'dimension'}
      ref={ref}
      style={{ height: height || 'unset' }}
    >
      <div className={'dimension-display-name'}>
        {searching ? (
          <Input
            prefix={<SearchOutlined />}
            autoFocus={true}
            placeholder={i18n('请输入关键字搜索')}
            allowClear={true}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        ) : (
          <>
            <span>{displayName}</span>
            <Tooltip placement="top" title={i18n('搜索')}>
              <Button
                type="default"
                icon={<SearchOutlined />}
                className={'search-btn'}
                onClick={onShowSearchInput}
              />
            </Tooltip>
          </>
        )}
      </div>

      <div className={'dimension-items'}>
        {filterResult.map((i) => (
          <DimensionItem
            {...i}
            key={i.id}
            onUpdateCheckItem={onUpdateCheckItem}
          />
        ))}
      </div>

      <div className={'summary'}>
        <Checkbox
          indeterminate={indeterminate}
          checked={checkedAll}
          disabled={filterResult.length === 0}
          onChange={(e) => onUpdateCheckedAll(e.target.checked)}
        />

        <span className={'total'} onClick={onFilterAllChecked}>
          {i18n('已选 {} 项').replace('{}', checkedList.length)}
        </span>

        {filterChecked && (
          <Button
            ghost={true}
            className={'reset'}
            onClick={() => {
              setFilterChecked(false);
            }}
          >
            {i18n('恢复')}
          </Button>
        )}
      </div>
    </div>
  );
};

interface DimensionItemProps extends DimensionItem {
  onUpdateCheckItem: (id: string, checked: boolean) => void;
}

const DimensionItem: FC<DimensionItemProps> = ({
  id,
  checked,
  disabled,
  displayName,
  onUpdateCheckItem,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [ellipsis, setEllipsis] = useState(false);

  useEffect(() => {
    // 针对超长文字，添加 tooltip
    setEllipsis(
      ref.current.offsetWidth > ref.current.parentElement.offsetWidth,
    );
  }, []);

  return (
    <div className={'dimension-item'}>
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          onUpdateCheckItem(id, e.target.checked);
        }}
      >
        {ellipsis ? (
          <Tooltip title={displayName} placement="topLeft">
            <span className={'dimension-item-name'} ref={ref}>
              {displayName}
            </span>
          </Tooltip>
        ) : (
          <span className={'dimension-item-name'} ref={ref}>
            {displayName}
          </span>
        )}
      </Checkbox>
    </div>
  );
};

export default Dimension;
