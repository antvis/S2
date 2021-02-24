import * as React from 'react';
import { InfosProps } from '../interface';
import { INFO_CLASS } from '../constant';

export class Infos extends React.PureComponent<InfosProps, {}> {
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
    const { infos = '' } = this.props;
    return <div className={INFO_CLASS}>{infos}</div>;
  }
}
