import { RootInteraction } from '@/interaction/root';
import { SpreadSheet } from '@/index';
import { BaseEvent } from '@/interaction/base-event';

const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;

describe('Base Interaction Event Test', () => {
  test('should get interaction and spreadsheet instance and call bind func', () => {
    const bindEventsImpl = jest.fn();
    class MyInteraction extends BaseEvent {
      bindEvents() {
        bindEventsImpl();
      }
    }

    const myInteraction = new MyInteraction(
      new MockSpreadSheet(),
      new RootInteraction(new MockSpreadSheet()),
    );
    expect(myInteraction).toBeDefined();
    expect(myInteraction.spreadsheet).toBeInstanceOf(SpreadSheet);
    expect(myInteraction.interaction).toBeInstanceOf(RootInteraction);
    expect(bindEventsImpl).toHaveBeenCalledTimes(1);
  });
});
