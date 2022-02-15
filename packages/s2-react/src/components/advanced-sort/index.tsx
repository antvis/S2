import React, { useState, useEffect } from 'react';
import { Modal, Button, Layout, Select, Radio, Form, Cascader } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  isEqual,
  keys,
  map,
  includes,
  toUpper,
  forEach,
  filter,
  find,
  uniq,
} from 'lodash';
import cx from 'classnames';
import { SpreadSheet, SortParam, SortMethod, TOTAL_VALUE } from '@antv/s2';
import { SortIcon } from '../icons';
import { CustomSort } from './custom-sort';
import { i18n } from '@/common/i18n';
import { SORT_METHOD, RULE_OPTIONS, ADVANCED_PRE_CLS } from '@/common/constant';
import './index.less';

const { Sider, Content } = Layout;

export interface Dimension {
  field: string;
  name: string;
  list: string[];
}

export interface RuleOption {
  label: string;
  value: 'sortMethod' | 'sortBy' | 'sortByMeasure';
  children?: RuleOption[];
}

export interface RuleValue {
  field: string;
  name: string;
  sortMethod?: SortMethod;
  sortBy?: string[];
  sortByMeasure?: string;
}

export interface AdvancedSortCfgProps {
  open: boolean;
  className?: string;
  icon?: React.ReactNode;
  text?: string;
  ruleText?: string;
  dimensions?: Dimension[];
  ruleOptions?: RuleOption[];
  sortParams?: SortParam[];
  onSortOpen?: () => void;
  onSortConfirm?: (ruleValues: RuleValue[], sortParams: SortParam[]) => void;
}

export interface AdvancedSortProps extends AdvancedSortCfgProps {
  sheet: SpreadSheet;
}

export const AdvancedSort: React.FC<AdvancedSortProps> = ({
  sheet,
  className,
  icon,
  text,
  ruleText,
  dimensions,
  ruleOptions,
  sortParams,
  onSortOpen,
  onSortConfirm,
}) => {
  const [isSortVisible, setIsModalVisible] = useState(false);
  const [isCustomVisible, setIsCustomVisible] = useState(false);
  const [ruleList, setRuleList] = useState([]);
  const [rules, setRules] = useState([]);
  const [manualDimensionList, setManualDimensionList] = useState([]);
  const [dimensionList, setDimensionList] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [currentDimension, setCurrentDimension] = useState<Dimension>();
  const [form] = Form.useForm();

  const handleModal = () => {
    setIsModalVisible(!isSortVisible);
  };
  const sortClick = () => {
    if (onSortOpen) {
      onSortOpen();
    }
    handleModal();
  };
  const handleCustom = () => {
    setIsCustomVisible(!isCustomVisible);
  };
  const handleDimension = (dimension) => {
    if (!find(ruleList, (item) => item.field === dimension.field)) {
      setCurrentDimension(dimension);
      setRuleList([...ruleList, dimension]);
    }
    setDimensionList(
      filter(dimensionList, (item) => item.field !== dimension.field),
    );
  };
  const handleCustomSort = (dimension, splitOrders) => {
    handleCustom();
    setCurrentDimension(dimension);
    if (splitOrders) {
      setSortBy(uniq(splitOrders));
    } else {
      setSortBy(
        uniq(
          find(manualDimensionList, (item) => item.field === dimension.field)
            ?.list || [],
        ),
      );
    }
  };
  const customSort = () => {
    handleCustom();
    const currentFieldValue = form.getFieldsValue([currentDimension?.field]);
    currentFieldValue.sortBy = sortBy;
    form.setFieldsValue({ [currentDimension?.field]: currentFieldValue });
    const newRuleList = map(ruleList, (item) => {
      if (item.field === currentDimension?.field) {
        return {
          ...item,
          rule: 'sortBy',
          sortBy,
          sortMethod: '',
          sortByMeasure: '',
        };
      }
      return item;
    });
    setRuleList(newRuleList);
  };
  const customCancel = () => {
    handleCustom();
  };
  const deleteRule = (dimension) => {
    setRuleList(filter(ruleList, (item) => item.field !== dimension.field));
    setDimensionList([...dimensionList, dimension]);
  };
  const onFinish = () => {
    const ruleValue = form.getFieldsValue();
    const { values = [] } = sheet.dataCfg.fields;
    const ruleValues = [];
    const currentSortParams = [];
    forEach(keys(ruleValue), (item) => {
      const { sortMethod, rule = [], sortBy: currentSortBy } = ruleValue[item];
      const current: SortParam = { sortFieldId: item };
      if (rule[0] === 'sortByMeasure' || rule[1]) {
        // 如果不是数值 key ，则按照汇总值排序
        if (!includes(values, rule[1])) {
          current.sortByMeasure = TOTAL_VALUE;
        } else {
          current.sortByMeasure = rule[1];
        }
        current.sortMethod = sortMethod;
        current.query = {
          $$extra$$: rule[1],
        };
      } else if (rule[0] === 'sortBy') {
        current.sortBy = currentSortBy;
      } else {
        current.sortMethod = sortMethod;
      }
      ruleValues.push({ field: item, ...ruleValue[item] });
      currentSortParams.push(current);
    });
    if (onSortConfirm) {
      onSortConfirm(ruleValues, currentSortParams);
    }
    handleModal();
  };
  const getDimensionList = (list) => {
    return filter(
      list,
      (item) => !find(sortParams, (i) => i.sortFieldId === item.field),
    );
  };
  const getManualDimensionList = () => {
    if (dimensions) {
      return dimensions;
    }
    const { fields = {} } = sheet.dataCfg || {};
    const { rows = [], columns = [] } = fields;
    return map([...rows, ...columns], (item) => {
      return {
        field: item,
        name: sheet.dataSet.getFieldName(item),
        list: sheet.dataSet.getDimensionValues(item),
      };
    });
  };
  const getRuleOptions = () => {
    if (ruleOptions) {
      return ruleOptions;
    }
    return map(RULE_OPTIONS, (item) => {
      if (item.value === 'sortByMeasure') {
        const { values } = sheet.dataCfg.fields || {};
        item.children = map(values, (vi) => {
          return { label: sheet.dataSet.getFieldName(vi), value: vi };
        });
      }
      return item;
    });
  };
  const getRuleList = () => {
    return map(sortParams, (item) => {
      const {
        sortFieldId,
        sortMethod,
        sortBy: currentSortBy,
        sortByMeasure,
      } = item;
      let rule: string[];
      if (currentSortBy) {
        rule = ['sortBy'];
      } else if (sortByMeasure) {
        rule = ['sortByMeasure', sortByMeasure];
      } else {
        rule = ['sortMethod'];
      }
      return {
        field: sortFieldId,
        name: sheet.dataSet.getFieldName(sortFieldId),
        rule,
        sortMethod,
        sortBy: currentSortBy,
        sortByMeasure,
      };
    });
  };

  const renderSider = () => {
    return (
      <Sider width={120} className={`${ADVANCED_PRE_CLS}-sider-layout`}>
        <div className={`${ADVANCED_PRE_CLS}-title`}>{i18n('可选字段')}</div>
        <div>
          {map(dimensionList, (item) => {
            return (
              <div
                className={`${ADVANCED_PRE_CLS}-dimension-item`}
                key={item.field}
                onClick={() => {
                  handleDimension(item);
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </Sider>
    );
  };
  const renderContent = () => {
    return (
      <Content className={`${ADVANCED_PRE_CLS}-content-layout`}>
        <div className={`${ADVANCED_PRE_CLS}-title`}>
          {ruleText || i18n('按以下规则进行排序（优先级由低到高）')}
        </div>
        <Form
          form={form}
          name="form"
          className={`${ADVANCED_PRE_CLS}-custom-form`}
        >
          {map(ruleList, (item) => {
            const {
              field,
              name,
              rule,
              sortMethod,
              sortBy: currentSortBy,
            } = item || {};
            return (
              <Form.Item name={field} key={field}>
                <Form.Item name={[field, 'name']} initialValue={name} noStyle>
                  <Select
                    className={`${ADVANCED_PRE_CLS}-select`}
                    size="small"
                  />
                </Form.Item>
                <span className={`${ADVANCED_PRE_CLS}-field-prefix`}>
                  {i18n('按')}
                </span>
                <Form.Item
                  name={[field, 'rule']}
                  initialValue={rule || ['sortMethod']}
                  noStyle
                >
                  <Cascader
                    options={rules}
                    expandTrigger="hover"
                    size="small"
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldValue }) => {
                    return !isEqual(getFieldValue([field, 'rule']), [
                      'sortBy',
                    ]) ? (
                      <Form.Item
                        shouldUpdate
                        noStyle
                        name={[field, 'sortMethod']}
                        initialValue={toUpper(sortMethod) || 'ASC'}
                      >
                        <Radio.Group className={`${ADVANCED_PRE_CLS}-rule-end`}>
                          {map(SORT_METHOD, (i) => {
                            return (
                              <Radio value={i.value} key={i.value}>
                                {i.name}
                              </Radio>
                            );
                          })}
                        </Radio.Group>
                      </Form.Item>
                    ) : (
                      <>
                        <a
                          className={`${ADVANCED_PRE_CLS}-rule-end`}
                          onClick={() => {
                            handleCustomSort(item, currentSortBy);
                          }}
                        >
                          {i18n('设置顺序')}
                        </a>
                        <Form.Item
                          noStyle
                          name={[field, 'sortBy']}
                          initialValue={currentSortBy}
                        />
                      </>
                    );
                  }}
                </Form.Item>
                <DeleteOutlined
                  className={`${ADVANCED_PRE_CLS}-rule-end-delete`}
                  onClick={() => {
                    deleteRule(item);
                  }}
                />
              </Form.Item>
            );
          })}
        </Form>
      </Content>
    );
  };

  useEffect(() => {
    if (isSortVisible) {
      const initRuleList = getRuleList();
      const manualDimensions = getManualDimensionList();
      const initDimensionList = getDimensionList(manualDimensions);
      const initRuleOptions = getRuleOptions();
      setRuleList(initRuleList);
      setManualDimensionList(manualDimensions);
      setDimensionList(initDimensionList);
      setRules(initRuleOptions);
    }
  }, [isSortVisible]);

  return (
    <div className={cx(ADVANCED_PRE_CLS, className)}>
      <Button
        onClick={sortClick}
        icon={icon || <SortIcon />}
        size="small"
        className={`${ADVANCED_PRE_CLS}-btn`}
      >
        {text || i18n('高级排序')}
      </Button>
      <Modal
        title={text || i18n('高级排序')}
        visible={isSortVisible}
        onOk={onFinish}
        onCancel={handleModal}
        okText={i18n('确定')}
        cancelText={i18n('取消')}
        destroyOnClose
        className={`${ADVANCED_PRE_CLS}-modal`}
      >
        <Layout>
          {renderSider()}
          {renderContent()}
        </Layout>
      </Modal>
      <Modal
        title={i18n('手动排序')}
        visible={isCustomVisible}
        onOk={customSort}
        onCancel={customCancel}
        okText={i18n('确定')}
        cancelText={i18n('取消')}
        destroyOnClose
        className={`${ADVANCED_PRE_CLS}-custom-modal`}
      >
        <CustomSort splitOrders={sortBy} setSplitOrders={setSortBy} />
      </Modal>
    </div>
  );
};
