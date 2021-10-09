import { SpreadSheet } from '@/index';
import { BaseEvent } from '@/interaction/base-event';

jest.mock('@/index');

const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;

describe('Base Interaction Event Test', () => {
  test('should get spreadsheet instance and call the bind function', () => {
    const bindEventsImpl = jest.fn();
    class MyInteraction extends BaseEvent {
      bindEvents() {
        bindEventsImpl();
      }
    }

    const myInteraction = new MyInteraction(new MockSpreadSheet());
    expect(myInteraction).toBeDefined();
    expect(myInteraction.spreadsheet).toBeInstanceOf(SpreadSheet);
    expect(bindEventsImpl).toHaveBeenCalledTimes(1);
  });
});
