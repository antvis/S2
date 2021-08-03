import React from 'react';
import {
  useVisible,
  useCustomChild,
  useHide,
} from '@/components/dimension-switch/hooks';
import { renderHook, act } from '@testing-library/react-hooks';
import { DimensionType } from '@/components/dimension-switch/dimension';

describe('Dimension Switch Hook Test', () => {
  describe('useVisible Test', () => {
    test('should update visible status correctly when call show or hide function', () => {
      const { result } = renderHook(() => useVisible());

      expect(result.current.visible).toBeFalsy();

      act(() => {
        result.current.show();
      });
      expect(result.current.visible).toBeTruthy();

      act(() => {
        result.current.hide();
      });
      expect(result.current.visible).toBeFalsy();
    });

    test('should update visible status correctly when call toggle function', () => {
      const { result } = renderHook(() => useVisible(true));

      expect(result.current.visible).toBeTruthy();

      act(() => {
        result.current.toggle();
      });
      expect(result.current.visible).toBeFalsy();

      act(() => {
        result.current.toggle();
      });
      expect(result.current.visible).toBeTruthy();
    });
  });

  describe('useCustomChild Test', () => {
    test('should render default child without specify custom child', () => {
      const { result } = renderHook(() =>
        useCustomChild(<div>default child</div>),
      );

      expect(result.current.props.children).toEqual('default child');
    });

    test('should render custom child with specify custom child', () => {
      const { result } = renderHook(() =>
        useCustomChild(<div>default child</div>, <div>custom child</div>),
      );

      expect(result.current.props.children).toEqual('custom child');
    });
  });

  describe('useHide Test', () => {
    test('should return true when every dimension items is empty', () => {
      const mockData: DimensionType[] = [
        {
          type: 'value',
          displayName: '指标',
          items: [],
        },
      ];
      const { result } = renderHook(() => useHide(mockData));

      expect(result.current).toBeTruthy();
    });

    test('should return true when every dimension has items', () => {
      const mockData: DimensionType[] = [
        {
          type: 'value',
          displayName: '指标',
          items: [
            {
              id: 'price',
              displayName: '价格',
              checked: true,
            },
            {
              id: 'city',
              displayName: '城市',
              checked: true,
            },
          ],
        },
      ];
      const { result } = renderHook(() => useHide(mockData));

      expect(result.current).toBeFalsy();
    });
  });
});
