import { getLang, i18n, setLang, type LangType } from '@/common/i18n';

describe('I18n Test', () => {
  test('should get default chinese lang', () => {
    expect(getLang()).toEqual('zh_CN');
  });

  test('should set custom lang', () => {
    setLang('en_US');
    expect(getLang()).toEqual('en_US');
  });

  test('should get default chinese lang if receive a empty lang type', () => {
    setLang(null as unknown as LangType);
    expect(getLang()).toEqual('zh_CN');
  });

  test('should show english text when set lang to en', () => {
    setLang('en_US');
    expect(i18n('小计')).toEqual('Total');
    expect(i18n('总计')).toEqual('Total');
    expect(i18n('总和')).toEqual('(SUM)');
    expect(i18n('项')).toEqual('items');
    expect(i18n('已选择')).toEqual('selected');
    expect(i18n('序号')).toEqual('Index');
    expect(i18n('度量')).toEqual('Measure');
    expect(i18n('数值')).toEqual('Measure');
    expect(i18n('共计')).toEqual('Total');
    expect(i18n('条')).toEqual('');
    expect(i18n('，')).toEqual(', ');
  });

  test('should show Chinese text when set lang to zh', () => {
    setLang('zh_CN');
    expect(i18n('小计')).toEqual('小计');
    expect(i18n('总计')).toEqual('总计');
    expect(i18n('总和')).toEqual('（总和）');
    expect(i18n('项')).toEqual('项');
    expect(i18n('已选择')).toEqual('已选择');
    expect(i18n('序号')).toEqual('序号');
    expect(i18n('度量')).toEqual('度量');
    expect(i18n('数值')).toEqual('数值');
    expect(i18n('共计')).toEqual('共计');
    expect(i18n('条')).toEqual('条');
    expect(i18n('，')).toEqual('，');
  });
});
