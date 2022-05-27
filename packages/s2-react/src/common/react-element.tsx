import React from 'react';
import cx from 'classnames';
import { S2_PREFIX_CLS, TooltipContentType } from '@antv/s2';

interface Props {
  content: TooltipContentType;
  style?: any;
  className?: string;
}
export class ReactElement extends React.PureComponent<Props> {
  render() {
    const { style = {}, className, content } = this.props;
    let htmlNode: string;
    if (typeof content !== 'string') {
      htmlNode = content?.innerHTML || '';
    } else {
      htmlNode = content;
    }
    return (
      <div
        style={style}
        className={cx(`${S2_PREFIX_CLS}-react-element`, className)}
        dangerouslySetInnerHTML={{ __html: htmlNode }}
      />
    );
  }
}
