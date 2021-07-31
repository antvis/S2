import { isEmpty } from 'lodash';
import { Children, ReactElement, ReactNode, useState } from 'react';
import { DimensionType } from './dimension';

export const useVisible = (defaultVisible = false) => {
  const [visible, setVisible] = useState(defaultVisible);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const toggle = () => {
    setVisible(!visible);
  };
  return { visible, show, hide, toggle };
};

export const useCustomChild = (
  defaultChild: ReactElement,
  child?: ReactNode,
) => {
  return (child ? Children.only(child) : defaultChild) as ReactElement;
};

export const useHide = (data: DimensionType[]) => {
  return data.every((dimension) => isEmpty(dimension.items));
};
