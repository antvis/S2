import React, { cloneElement, FC } from 'react';
import { Modal, Popover, Button } from 'antd';
import { DimensionType } from './dimension';
import DimensionSwitch from './switch';
import {
  DownOutlined,
  EditOutlined,
  SwapOutlined,
  UpOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useCustomChild, useVisible, useHide } from './hooks';
import cx from 'classnames';
import { i18n } from '@/common/i18n';
import './index.less';

interface DimensionSwitchMultipleProps {
  overlayClassName?: string;
  data: DimensionType[];
  onUpdateDisableItems?: (type: string, checkedList: string[]) => string[];
  onSubmit?: (result: DimensionType[]) => void;
}
export const DimensionSwitchModal: FC<
  DimensionSwitchMultipleProps & { onModalVisibilityChange?: () => void }
> = ({
  overlayClassName,
  data,
  onSubmit: onOuterSubmit,
  onUpdateDisableItems,
  children,
  onModalVisibilityChange,
}) => {
  const { visible, show, hide } = useVisible();
  const shouldHide = useHide(data);
  const child = useCustomChild(
    <Button
      size="small"
      className={'ss-dimension-switch-icon-button'}
      icon={<EditOutlined />}
    />,
    children,
  );
  const onSubmit = (result: DimensionType[]) => {
    hide();
    onOuterSubmit?.(result);
  };
  const open = () => {
    onModalVisibilityChange?.();
    show();
  };
  return shouldHide ? null : (
    <>
      {cloneElement(child, { onClick: open })}
      <Modal
        title={i18n('选择分析信息')}
        visible={visible}
        footer={null}
        onCancel={() => hide()}
        destroyOnClose={true}
        width="fit-content"
        wrapClassName={cx('ss-dimension-switch-overlay', overlayClassName)}
        afterClose={onModalVisibilityChange}
      >
        <DimensionSwitch
          data={data}
          onSubmit={onSubmit}
          onUpdateDisableItems={onUpdateDisableItems}
        />
      </Modal>
    </>
  );
};

export const DimensionSwitchPopover: FC<DimensionSwitchMultipleProps> = ({
  overlayClassName,
  data,
  onSubmit: onOuterSubmit,
  onUpdateDisableItems,
  children,
}) => {
  const { visible, toggle, hide } = useVisible();
  const shouldHide = useHide(data);
  const child = useCustomChild(
    <Button size="small" icon={<SwapOutlined />}>
      {i18n('切换指标')}
    </Button>,
    children,
  );
  const onSubmit = (result: DimensionType[]) => {
    hide();
    onOuterSubmit?.(result);
  };
  return shouldHide ? null : (
    <Popover
      placement="bottomRight"
      trigger="click"
      visible={visible}
      title={
        <div className={'ss-dimension-switch-popover-title'}>
          {i18n('选择分析信息')}{' '}
          <Button
            size="small"
            className={'ss-dimension-switch-icon-button'}
            icon={<CloseOutlined />}
            onClick={hide}
          />
        </div>
      }
      content={
        <DimensionSwitch
          data={data}
          onSubmit={onSubmit}
          onUpdateDisableItems={onUpdateDisableItems}
        />
      }
      overlayClassName={cx('ss-dimension-switch-overlay', overlayClassName)}
      destroyTooltipOnHide={true}
    >
      {cloneElement(child, { onClick: toggle })}
    </Popover>
  );
};

interface DimensionSwitchDropdownProps {
  overlayClassName?: string;
  dimension: DimensionType;
  onUpdateDisableItems?: (type: string, checkedList: string[]) => string[];
  onSubmit?: (result: DimensionType[]) => void;
}
export const DimensionSwitchDropdown: FC<DimensionSwitchDropdownProps> = ({
  overlayClassName,
  dimension,
  onSubmit: onOuterSubmit,
  onUpdateDisableItems,
}) => {
  const selectContent = dimension.items
    .filter((i) => i.checked)
    .map((i) => i.displayName)
    .join(', ');

  const { visible, toggle, hide } = useVisible();
  const onSubmit = (result: DimensionType[]) => {
    hide();
    onOuterSubmit?.(result);
  };

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      visible={visible}
      content={
        <DimensionSwitch
          keepSearching={true}
          data={[dimension]}
          onSubmit={onSubmit}
          onUpdateDisableItems={onUpdateDisableItems}
        />
      }
      destroyTooltipOnHide={true}
      overlayClassName={cx(
        'ss-dimension-switch-overlay',
        'ss-dropdown-overlay',
        overlayClassName,
      )}
    >
      <div className={'ss-dropdown'} onClick={toggle}>
        <span className={'label'}>{dimension.displayName}</span>
        <span className={'content'}>{selectContent}</span>
        {visible ? <UpOutlined /> : <DownOutlined />}
      </div>
    </Popover>
  );
};
