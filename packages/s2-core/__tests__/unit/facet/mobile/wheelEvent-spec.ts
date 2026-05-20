import type { FederatedPointerEvent } from '@antv/g';

/**
 * Mock implementation of isMultiTouch function to test the logic
 */
const isMultiTouch = (evt: FederatedPointerEvent): boolean => {
  const nativeEvent = evt.nativeEvent as TouchEvent;

  // Check if it's a touch event with multiple touch points
  return nativeEvent?.touches?.length >= 2;
};

const createMockPointerEvent = (options: {
  touches?: Array<{ clientX: number; clientY: number }>;
  nativeEvent?: unknown;
}): Partial<FederatedPointerEvent> => {
  const { touches, nativeEvent } = options;

  // If nativeEvent is explicitly provided (including null), use it
  if ('nativeEvent' in options) {
    return {
      nativeEvent: nativeEvent as TouchEvent,
    };
  }

  // Otherwise create a touch event with the provided touches
  return {
    nativeEvent: {
      touches: touches as unknown as TouchList,
    } as TouchEvent,
  };
};

describe('Mobile WheelEvent - Multi-touch detection', () => {
  describe('isMultiTouch function', () => {
    test('should return true when 2 or more touches are detected (pinch-to-zoom)', () => {
      const twoTouchEvent = createMockPointerEvent({
        touches: [
          { clientX: 40, clientY: 40 },
          { clientX: 60, clientY: 60 },
        ],
      });

      expect(isMultiTouch(twoTouchEvent as FederatedPointerEvent)).toBe(true);
    });

    test('should return true when 3 or more touches are detected', () => {
      const threeTouchEvent = createMockPointerEvent({
        touches: [
          { clientX: 30, clientY: 30 },
          { clientX: 50, clientY: 50 },
          { clientX: 70, clientY: 70 },
        ],
      });

      expect(isMultiTouch(threeTouchEvent as FederatedPointerEvent)).toBe(true);
    });

    test('should return false when only 1 touch is detected (scroll gesture)', () => {
      const singleTouchEvent = createMockPointerEvent({
        touches: [{ clientX: 50, clientY: 50 }],
      });

      expect(isMultiTouch(singleTouchEvent as FederatedPointerEvent)).toBe(
        false,
      );
    });

    test('should return false when no touches (e.g., mouse event)', () => {
      const noTouchEvent = createMockPointerEvent({
        touches: [],
      });

      expect(isMultiTouch(noTouchEvent as FederatedPointerEvent)).toBe(false);
    });

    test('should return false when nativeEvent is null (mouse event fallback)', () => {
      const mouseEvent = createMockPointerEvent({
        nativeEvent: null,
      });

      expect(isMultiTouch(mouseEvent as FederatedPointerEvent)).toBe(false);
    });

    test('should return false when nativeEvent has no touches property', () => {
      const eventWithoutTouches = createMockPointerEvent({
        nativeEvent: {},
      });

      expect(isMultiTouch(eventWithoutTouches as FederatedPointerEvent)).toBe(
        false,
      );
    });

    test('should return false when touches is undefined', () => {
      const eventWithUndefinedTouches = createMockPointerEvent({
        nativeEvent: { touches: undefined },
      });

      expect(
        isMultiTouch(eventWithUndefinedTouches as FederatedPointerEvent),
      ).toBe(false);
    });
  });
});
