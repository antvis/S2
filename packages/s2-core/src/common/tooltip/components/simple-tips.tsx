/**
 * Create By Bruce Too
 * On 2020-05-26
 */
import * as React from 'react';
import { TipsProps } from '../interface';

const TIPS_CLASS = 'eva-facet-tooltip-tips';

export class SimpleTips extends React.PureComponent<TipsProps> {
  public render(): React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > {
    const { tips } = this.props;
    return <div className={TIPS_CLASS}>{tips}</div>;
  }
}
