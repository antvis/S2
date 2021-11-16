import * as React from 'react';
import cx from 'classnames';
import { S2_PREFIX_CLS } from '@antv/s2';

interface Props {
  element: Element | string;
  style?: any;
  className?: string;
}
export class ReactElement extends React.PureComponent<Props> {
  render() {
    const { style = {}, className, element } = this.props;
    let htmlNode: string;
    if (typeof element !== 'string') {
      htmlNode = element?.innerHTML || '';
    } else {
      htmlNode = element;
    }
    return (
      <span
        style={style}
        className={cx(`${S2_PREFIX_CLS}-react-element`, className)}
        dangerouslySetInnerHTML={{ __html: htmlNode }}
      />
    );
  }
}
