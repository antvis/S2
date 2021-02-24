/**
 * Create By Bruce Too
 * On 2020-05-26
 */
import * as React from 'react';
import { TipsProps } from '../interface';
import { TIPS_CLASS } from '../constant';

export class SimpleTips extends React.PureComponent<TipsProps, {}> {
  public render():
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number
    | {}
    | React.ReactNodeArray
    | React.ReactPortal
    | boolean
    | null
    | undefined {
    const { tips = '' } = this.props;
    return <div className={TIPS_CLASS}>{tips}</div>;
  }
}
