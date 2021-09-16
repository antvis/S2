import React, { FC, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { Checkbox, Tooltip } from 'antd';
import { DimensionItemProps, Item } from '.';

type SingleItemProps = Pick<
  DimensionItemProps,
  'fieldType' | 'onVisibleItemChange'
> &
  Omit<Item, 'derivedValues'> & {
    derivedId?: string;
    className: string;
  };
export const SingleItem: FC<SingleItemProps> = ({
  id,
  derivedId,
  displayName,
  fieldType,
  checked,
  className,
  onVisibleItemChange,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [ellipsis, setEllipsis] = useState(false);

  useEffect(() => {
    // 针对超长文字，添加 tooltip
    setEllipsis(ref.current.offsetWidth < ref.current.scrollWidth);
  }, []);

  return (
    <div className={cx('s2-switcher-item', className, { unchecked: !checked })}>
      {onVisibleItemChange && (
        <Checkbox
          checked={checked}
          onChange={(e) =>
            onVisibleItemChange?.(e.target.checked, fieldType, id, derivedId)
          }
        />
      )}
      {ellipsis ? (
        <Tooltip
          title={displayName}
          placement="bottomRight"
          overlayClassName={'s2-switcher-tooltip'}
        >
          <div className="s2-switcher-item-text" ref={ref}>
            {displayName}
          </div>
        </Tooltip>
      ) : (
        <div className="s2-switcher-item-text" ref={ref}>
          {displayName}
        </div>
      )}
    </div>
  );
};
