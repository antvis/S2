/* eslint-disable jest/no-standalone-expect */
/* eslint-disable react/no-deprecated */
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    version: '18.3.0',
  };
});

jest.mock('react-dom', () => {
  return {
    ...jest.requireActual('react-dom'),
    render: jest.fn(),
    unmountComponentAtNode: jest.fn(),
    createRoot: jest.fn(() => {
      return {
        render: jest.fn(),
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

describe('React 18 Render Tests', () => {
  test('should get correctly legacy react version', () => {
    expect(isLegacyReactVersion()).toBeFalsy();
  });

  test('should only call modern render', () => {
    reactRender(element, container);

    expect(ReactDOM.render).toHaveBeenCalledTimes(0);
    // @ts-ignore
    expect(ReactDOM.createRoot).toHaveBeenCalledTimes(1);
  });

  test('should only call modern unmount', () => {
    const root = reactRender(element, container);

    reactUnmount(container);

    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(0);
    expect(root).not.toBeDefined();
  });

  test('should only call modern render for force clear content', () => {
    const root = forceClearContent(container);

    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(0);
    expect(ReactDOM.render).toHaveBeenCalledTimes(0);
    expect(root.unmount).toHaveBeenCalledTimes(0);
    expect(root.render).toHaveBeenCalledTimes(1);
  });
});
