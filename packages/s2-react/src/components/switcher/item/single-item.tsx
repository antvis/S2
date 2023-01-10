import { Checkbox, Tooltip } from 'antd';
import cx from 'classnames';
import React, { type FC, useEffect, useRef, useState } from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import type { SwitcherField, SwitcherItem } from '../interface';
import { getSwitcherClassName } from '../util';
import type { DimensionCommonProps } from '.';

const CLASS_NAME_PREFIX = 'item';

type SingleItemProps = Omit<SwitcherItem, 'children'> &
  Pick<SwitcherField, 'selectable'> &
  DimensionCommonProps & {
    parentId?: string;
    disabled?: boolean;
    className: string;
    dragHandleProps?: DraggableProvided['dragHandleProps'];
  };

export const SingleItem: FC<SingleItemProps> = ({
  dragHandleProps,
  fieldType,
  id,
  displayName,
  selectable,
  checked,
  parentId,
  className,
  disabled,
  onVisibleItemChange,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ellipsis, setEllipsis] = useState(false);

  useEffect(() => {
    // 针对超长文字，添加 tooltip
    setEllipsis(ref.current?.offsetWidth! < ref.current?.scrollWidth!);
  }, []);

  const realDisplayName = displayName ?? id;

  return (
    <div
      {...dragHandleProps}
      className={cx(getSwitcherClassName(CLASS_NAME_PREFIX), className, {
        unchecked: !checked,
      })}
    >
      {selectable && (
        <Checkbox
          disabled={disabled}
          checked={checked}
          onChange={(e) =>
            onVisibleItemChange?.(fieldType, e.target.checked, id, parentId)
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
  disabled: false,
};
