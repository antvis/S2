import { isMultiSelectionKey } from 'src/utils/interaction/select-event';
import { InteractionKeyboardKey } from 'src/common/constant';

describe('Select Event Utils Tests', () => {
  describe('isMultiSelection test', () => {
    test('should return true for ctrl and meta key', () => {
      expect(
        isMultiSelectionKey({
          key: InteractionKeyboardKey.META,
        } as KeyboardEvent),
      ).toBe(true);

      expect(
        isMultiSelectionKey({
          key: InteractionKeyboardKey.CONTROL,
        } as KeyboardEvent),
      ).toBe(true);
    });
  });
});
