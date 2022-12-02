import React from 'react';
import cls from 'classnames';
import { S2_PREFIX_CLS } from '@antv/s2';

interface Props {
  content: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export class ReactElement extends React.PureComponent<Props> {
  render() {
    const { style = {}, className, content } = this.props;
    const commonProps: JSX.IntrinsicElements['span'] = {
      style,
      className: cls(`${S2_PREFIX_CLS}-react-element`, className),
    };

    // React 组件
    if (React.isValidElement(content)) {
      return (
        <span {...commonProps}>
          <>{content}</>
        </span>
      );
    }

    // DOM/字符串
    const htmlNode =
      typeof content !== 'string' ? (content as Element)?.innerHTML : content;

    return (
      <span {...commonProps} dangerouslySetInnerHTML={{ __html: htmlNode }} />
    );
  }
}
