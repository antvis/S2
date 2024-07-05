/* eslint-disable react/no-deprecated */
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    version: '16.9.0',
  };
});

jest.mock('react-dom', () => {
  return {
    ...jest.requireActual('react-dom'),
    render: jest.fn(),
    unmountComponentAtNode: jest.fn(),
    createRoot: jest.fn(() => {
      return {
        unmount: jest.fn(),
      };
    }),
  };
});

import {
  forceClearContent,
  isLegacyReactVersion,
  reactRender,
  reactUnmount,
} from '@/utils/reactRender';
import ReactDOM from 'react-dom';
import { getContainer } from '../../util/helpers';

const element = null;
const container = getContainer();

describe('React 16 Render Tests', () => {
  test('should get correctly legacy react version', () => {
    expect(isLegacyReactVersion()).toBeTruthy();
  });

  test('should only call legacy render', () => {
    reactRender(element, container);

    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(ReactDOM.createRoot).toHaveBeenCalledTimes(0);
  });

  test('should only call legacy unmount', () => {
    reactUnmount(container);

    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(1);
  });

  test('should only call modern render for force clear content', () => {
    const root = reactRender(element, container);

    forceClearContent(container);

    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(1);
    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    expect(root).not.toBeDefined();
  });
});
