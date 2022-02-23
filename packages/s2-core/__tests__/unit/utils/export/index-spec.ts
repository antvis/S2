import { copyToClipboard } from '@/utils/export';

describe('Copy Tests', () => {
  test('should async copy text to clipboard', async () => {
    const text = '222';

    await copyToClipboard(text);

    const result = await navigator.clipboard.readText();

    expect(result).toEqual(text);
  });

  test('should sync copy text to clipboard', async () => {
    const text = '222';

    jest.spyOn(document.body, 'removeChild').mockImplementationOnce(() => {
      return null;
    });

    await copyToClipboard(text, true);

    const result = await navigator.clipboard.readText();
    const textareaValue = document.querySelector('textarea').value;

    expect(result).toEqual(text);
    expect(textareaValue).toEqual(result);
    expect(textareaValue).toEqual(text);
  });

  // https://github.com/antvis/S2/issues/1112
  test('should sync copy text to clipboard if async copy failed', async () => {
    const text = '222';

    jest.spyOn(document.body, 'removeChild').mockImplementationOnce(() => {
      return null;
    });

    // 模拟复制失败
    jest
      .spyOn(navigator.clipboard, 'writeText')
      .mockImplementationOnce(() => Promise.reject());

    await copyToClipboard(text);

    const result = await navigator.clipboard.readText();
    const textareaValue = document.querySelector('textarea').value;

    expect(result).toEqual(text);
    expect(textareaValue).toEqual(result);
    expect(textareaValue).toEqual(text);
  });
});
