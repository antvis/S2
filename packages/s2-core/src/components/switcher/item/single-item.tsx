import { Checkbox, Tooltip } from 'antd';
import cx from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { SwitcherItem } from '../interface';
import { getSwitcherClassName } from '../util';
import { DimensionCommonProps } from '.';

const CLASS_NAME_PREFIX = 'item';

type SingleItemProps = Omit<SwitcherItem, 'derivedValues'> &
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

  const realDisplayName = displayName ?? id;
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
          title={realDisplayName}
          placement="bottomRight"
          overlayClassName={getSwitcherClassName('tooltip')}
        >
          <div
            className={getSwitcherClassName(CLASS_NAME_PREFIX, 'text')}
            ref={ref}
          >
            {realDisplayName}
          </div>
        </Tooltip>
      ) : (
        <div
          className={getSwitcherClassName(CLASS_NAME_PREFIX, 'text')}
          ref={ref}
        >
          {realDisplayName}
        </div>
      )}
    </div>
  );
};

SingleItem.defaultProps = {
  checked: true,
};
