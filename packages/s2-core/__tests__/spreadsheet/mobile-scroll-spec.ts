import { OriginEventType } from '@/common';
import { Canvas, FederatedPointerEvent } from '@antv/g';
import { WheelEvent } from '../../src/facet/mobile/wheelEvent';

describe('Mobile Scroll WheelEvent Tests', () => {
  let canvas: Canvas;
  let wheelEvent: WheelEvent;

  beforeEach(() => {
    // Mock Canvas
    canvas = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as Canvas;
  });

  afterEach(() => {
    wheelEvent?.destroy();
  });

  test('should bind events on init', () => {
    wheelEvent = new WheelEvent(canvas);
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      OriginEventType.POINTER_DOWN,
      expect.any(Function),
    );
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      OriginEventType.POINTER_MOVE,
      expect.any(Function),
    );
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      OriginEventType.POINTER_UP,
      expect.any(Function),
    );
  });

  test('should remove events on destroy', () => {
    wheelEvent = new WheelEvent(canvas);
    wheelEvent.destroy();
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      OriginEventType.POINTER_DOWN,
      expect.any(Function),
    );
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      OriginEventType.POINTER_MOVE,
      expect.any(Function),
    );
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      OriginEventType.POINTER_UP,
      expect.any(Function),
    );
  });

  describe('preventDefault logic', () => {
    let mockPreventDefault: jest.Mock;
    let mockNativeEvent: any;
    let mockEvent: FederatedPointerEvent;

    beforeEach(() => {
      mockPreventDefault = jest.fn();
      mockNativeEvent = {
        cancelable: true,
        preventDefault: mockPreventDefault,
        touches: [{ clientX: 0, clientY: 0 }],
      };
      mockEvent = {
        nativeEvent: mockNativeEvent,
        x: 100,
        y: 100,
        clone: jest.fn().mockReturnValue({}),
      } as unknown as FederatedPointerEvent;

      jest.spyOn(window, 'cancelAnimationFrame');
      jest.spyOn(window, 'requestAnimationFrame');
    });

    test('should call preventDefault when shouldPreventDefault returns true', () => {
      const shouldPreventDefault = jest.fn().mockReturnValue(true);

      wheelEvent = new WheelEvent(canvas, shouldPreventDefault);

      // Trigger pointer down to start panning
      const pointerDownHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_DOWN,
      )[1];

      pointerDownHandler({ ...mockEvent, x: 0, y: 0 });

      // Trigger pointer move
      const pointerMoveHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_MOVE,
      )[1];

      pointerMoveHandler(mockEvent);

      expect(shouldPreventDefault).toHaveBeenCalled();
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    test('should NOT call preventDefault when shouldPreventDefault returns false', () => {
      const shouldPreventDefault = jest.fn().mockReturnValue(false);

      wheelEvent = new WheelEvent(canvas, shouldPreventDefault);

      // Trigger pointer down to start panning
      const pointerDownHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_DOWN,
      )[1];

      pointerDownHandler({ ...mockEvent, x: 0, y: 0 });

      // Trigger pointer move
      const pointerMoveHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_MOVE,
      )[1];

      pointerMoveHandler(mockEvent);

      expect(shouldPreventDefault).toHaveBeenCalled();
      expect(mockPreventDefault).not.toHaveBeenCalled();
    });

    test('should call preventDefault by default if shouldPreventDefault is not provided', () => {
      wheelEvent = new WheelEvent(canvas);

      // Trigger pointer down to start panning
      const pointerDownHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_DOWN,
      )[1];

      pointerDownHandler({ ...mockEvent, x: 0, y: 0 });

      // Trigger pointer move
      const pointerMoveHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_MOVE,
      )[1];

      pointerMoveHandler(mockEvent);

      expect(mockPreventDefault).toHaveBeenCalled();
    });

    test('should NOT call preventDefault if event is not cancelable', () => {
      const shouldPreventDefault = jest.fn().mockReturnValue(true);

      wheelEvent = new WheelEvent(canvas, shouldPreventDefault);

      mockNativeEvent.cancelable = false;

      // Trigger pointer down to start panning
      const pointerDownHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_DOWN,
      )[1];

      pointerDownHandler({ ...mockEvent, x: 0, y: 0 });

      // Trigger pointer move
      const pointerMoveHandler = (
        canvas.addEventListener as any
      ).mock.calls.find(
        (call: any[]) => call[0] === OriginEventType.POINTER_MOVE,
      )[1];

      pointerMoveHandler(mockEvent);

      expect(shouldPreventDefault).not.toHaveBeenCalled(); // Optimization: check cancelable before calling callback? Not strictly required but typically safer.
      // Actually implementation calls callback only if cancelable. Let's check implementation again.
      // Implementation: if (nativeEvent?.cancelable) { ... }
      // So if not cancelable, logic inside is skipped.

      expect(mockPreventDefault).not.toHaveBeenCalled();
    });
  });
});
