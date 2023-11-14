import { PureComponent } from 'react';

export class TabPane extends PureComponent {
  render() {
    const { children } = this.props;

    return children;
  }
}
