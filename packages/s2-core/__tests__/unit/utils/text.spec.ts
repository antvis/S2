import { getEllipsisText } from '@/utils/text';

describe('Calculate Text Ellipsis', () => {
  it('should get correct text', () => {
    const text = getEllipsisText({
      text: '12',
      maxWidth: 200,
      placeholder: '--',
    });

    expect(text).toEqual('12');
  });

  it('should get correct text ellipsis', () => {
    const text = getEllipsisText({
      text: '12121212121212121212',
      maxWidth: 20,
      placeholder: '--',
    });

    expect(text).toEqual('12...');
  });

  it('should get correct placeholder text with ""', () => {
    const text = getEllipsisText({
      text: '',
      maxWidth: 20,
      placeholder: '--',
    });

    expect(text).toEqual('');
  });

  it('should get correct placeholder text with 0', () => {
    const text = getEllipsisText({
      text: 0 as unknown as string,
      maxWidth: 20,
      placeholder: '--',
    });

    expect(text).toEqual(0);
  });
  it('should get correct placeholder text with null', () => {
    const text = getEllipsisText({
      text: null,
      maxWidth: 20,
      placeholder: '--',
    });

    expect(text).toEqual('--');
  });
});
