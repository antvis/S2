import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { S2Options } from '@antv/s2';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { SheetComponent } from '../../src';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 600,
  height: 600,
  hierarchyType: 'grid',
};

describe('Spread Sheet Tests', () => {
  const hasScrollBar = (container: HTMLElement) => {
    const s2Container = container.querySelector('.antv-s2-container');
    return (
      (s2Container.scrollWidth > s2Container.clientWidth ||
        document.body.scrollWidth > window.innerWidth) &&
      window.getComputedStyle(s2Container).overflow !== 'hidden'
    );
  };

  describe('Mount Sheet tests', () => {
    let container: HTMLDivElement;
    beforeEach(() => {
      container = getContainer();
    });

    afterEach(() => {
      container?.remove();
    });

    test('should display scroll bar if s2Options.width more than browser window width', () => {
      act(() => {
        ReactDOM.render(
          <SheetComponent
            options={{
              ...s2Options,
              width: window.innerWidth + 100,
            }}
            dataCfg={mockDataConfig}
          />,
          container,
        );
      });

      expect(hasScrollBar(container)).toBeTruthy();
    });

    test.skip('should hidden scroll bar if window width more than s2Options.width', () => {
      act(() => {
        ReactDOM.render(
          <SheetComponent options={s2Options} dataCfg={mockDataConfig} />,
          container,
        );
      });

      expect(hasScrollBar(container)).toBeFalsy();
    });
  });
});
