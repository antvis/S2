import { Checkbox, Tooltip } from 'antd';
import cx from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Item } from '../interface';
import { getSwitcherClassName } from '../util';
import { DimensionCommonProps } from '.';

const CLASS_NAME_PREFIX = 'item';

type SingleItemProps = Omit<Item, 'derivedValues'> &
  Pick<DimensionCommonProps, 'fieldType' | 'onVisibleItemChange'> & {
    derivedId?: string;
    className: string;
  };

export const SingleItem: FC<SingleItemProps> = ({
  fieldType,
  id,
  displayName,
  checked,
  derivedId,
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
    <div
      className={cx(getSwitcherClassName(CLASS_NAME_PREFIX), className, {
        unchecked: !checked,
      })}
    >
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
          overlayClassName={getSwitcherClassName('tooltip')}
        >
          <div
            className={getSwitcherClassName(CLASS_NAME_PREFIX, 'text')}
            ref={ref}
          >
            {displayName}
          </div>
        </Tooltip>
      ) : (
        <div
          className={getSwitcherClassName(CLASS_NAME_PREFIX, 'text')}
          ref={ref}
        >
          {displayName}
        </div>
      )}
    </div>
  );
};

SingleItem.defaultProps = {
  checked: true,
};
