import React from 'react';
import { debounce } from 'lodash';
import type { SpreadSheet } from '../../sheet-type/spread-sheet';
import type { SpreadsheetProps } from '../sheets/interface';

// ref: https://github.com/podefr/react-debounce-render

type DebounceRenderContainerProps = SpreadsheetProps &
  React.RefAttributes<SpreadSheet> & {
    forwardedRef: React.MutableRefObject<SpreadSheet>;
  };

export function debounceRenderHOC(
  Component: React.ComponentType<SpreadsheetProps>,
  delay: number,
) {
  class DebounceRenderContainer extends React.Component<DebounceRenderContainerProps> {
    static displayName = `DebounceRenderContainer(${
      Component.displayName || Component.name || 'DebounceRenderContainer'
    })`;

    updateDebounced = debounce(this.forceUpdate, delay);

    shouldComponentUpdate() {
      this.updateDebounced();
      return false;
    }

    componentWillUnmount() {
      this.updateDebounced.cancel();
    }

    render() {
      const { forwardedRef, ...restProps } = this.props;
      return <Component ref={forwardedRef} {...restProps} />;
    }
  }

  return React.forwardRef(
    (props: SpreadsheetProps, ref: React.MutableRefObject<SpreadSheet>) => {
      return <DebounceRenderContainer {...props} forwardedRef={ref} />;
    },
  );
}
