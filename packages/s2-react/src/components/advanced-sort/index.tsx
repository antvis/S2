import { DeleteOutlined } from '@ant-design/icons';
import {
  i18n,
  type SortMethod,
  type SortParam,
  SpreadSheet,
  TOTAL_VALUE,
  EXTRA_FIELD,
} from '@antv/s2';
import { Button, Cascader, Form, Layout, Modal, Radio, Select } from 'antd';
import cx from 'classnames';
import {
  filter,
  find,
  forEach,
  includes,
  isEqual,
  keys,
  map,
  toUpper,
  uniq,
} from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  ADVANCED_SORT_PRE_CLS,
  getSortRuleOptions,
  getSortMethod,
} from '@antv/s2-shared';
import { SortIcon } from '../icons';
import { CustomSort } from './custom-sort';
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

export interface AdvancedSortBaseProps {
  open?: boolean;
  className?: string;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  ruleText?: React.ReactNode;
  dimensions?: Dimension[];
  ruleOptions?: RuleOption[];
  sortParams?: SortParam[];
  onSortOpen?: () => void;
  onSortConfirm?: (ruleValues: RuleValue[], sortParams: SortParam[]) => void;
}

export interface AdvancedSortProps extends AdvancedSortBaseProps {
  sheet: SpreadSheet;
}

export type RuleItem = RuleValue & { rule: string[] };

export const AdvancedSort: React.FC<AdvancedSortProps> = React.memo(
  ({
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
    const [ruleList, setRuleList] = useState<RuleItem[]>([]);
    const [rules, setRules] = useState<RuleItem[]>([]);
    const [manualDimensionList, setManualDimensionList] = useState<Dimension[]>(
      [],
    );
    const [dimensionList, setDimensionList] = useState<Dimension[]>([]);
    const [sortBy, setSortBy] = useState<string[]>([]);
    const [currentDimension, setCurrentDimension] = useState<Dimension>();
    const [form] = Form.useForm();

    const SORT_RULE_OPTIONS = React.useMemo(getSortRuleOptions, []);
    const SORT_METHOD = React.useMemo(getSortMethod, []);

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

    const handleDimension = (dimension: Dimension) => {
      if (!find(ruleList, (item) => item.field === dimension.field)) {
        setCurrentDimension(dimension);
        setRuleList([...ruleList, dimension] as RuleItem[]);
      }

      setDimensionList(
        filter(dimensionList, (item) => item.field !== dimension.field),
      );
    };

    const handleCustomSort = (dimension: Dimension, splitOrders?: string[]) => {
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
      const currentFieldValue = form.getFieldsValue([currentDimension?.field!]);

      currentFieldValue.sortBy = sortBy;
      form.setFieldsValue({ [currentDimension?.field!]: currentFieldValue });
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
      }) as unknown as RuleItem[];

      setRuleList(newRuleList);
    };

    const customCancel = () => {
      handleCustom();
    };

    const deleteRule = (dimension: Dimension) => {
      setRuleList(filter(ruleList, (item) => item.field !== dimension.field));
      setDimensionList([...dimensionList, dimension]);
    };

    const onFinish = () => {
      const ruleValue = form.getFieldsValue();
      const { values = [] } = sheet.dataCfg.fields;
      const ruleValues: RuleValue[] = [];
      const currentSortParams: SortParam[] = [];

      forEach(keys(ruleValue), (item) => {
        const {
          sortMethod,
          rule = [],
          sortBy: currentSortBy,
        } = ruleValue[item];
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
            [EXTRA_FIELD]: rule[1],
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

    const getDimensionList = (list: Dimension[]) =>
      filter(
        list,
        (item: Dimension) =>
          !find(
            sortParams,
            (sortParam) => sortParam.sortFieldId === item.field,
          ),
      );

    const getManualDimensionList = (): Dimension[] => {
      if (dimensions) {
        return dimensions;
      }

      const { fields = {} } = sheet.dataCfg || {};
      const { rows = [], columns = [] } = fields;

      return map([...rows, ...columns], (item) => {
        const name = typeof item === 'string' ? item : item.field;

        return {
          field: item,
          name: sheet.dataSet.getFieldName(name),
          list: sheet.dataSet.getDimensionValues(name),
        };
      }) as unknown as Dimension[];
    };

    const getRuleOptions = () => {
      if (ruleOptions) {
        return ruleOptions;
      }

      return map(SORT_RULE_OPTIONS, (item) => {
        if (item.value === 'sortByMeasure') {
          const { values = [] } = sheet.dataCfg.fields || {};

          // @ts-ignore
          item.children = map(values, (field) => {
            return {
              label: sheet.dataSet.getFieldName(field),
              value: field,
            };
          });
        }

        return item;
      });
    };

    const getRuleList = (): RuleItem[] =>
      map(sortParams, (item) => {
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

    const renderSide = () => (
      <Sider width={120} className={`${ADVANCED_SORT_PRE_CLS}-sider-layout`}>
        <div className={`${ADVANCED_SORT_PRE_CLS}-title`}>
          {i18n('可选字段')}
        </div>
        <div>
          {map(dimensionList, (item) => (
            <div
              className={`${ADVANCED_SORT_PRE_CLS}-dimension-item`}
              key={item.field}
              title={item.name}
              onClick={() => {
                handleDimension(item);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </Sider>
    );

    const renderContent = () => (
      <Content className={`${ADVANCED_SORT_PRE_CLS}-content-layout`}>
        <div className={`${ADVANCED_SORT_PRE_CLS}-title`}>
          {ruleText || i18n('按以下规则进行排序（优先级由低到高）')}
        </div>
        <Form
          form={form}
          name="form"
          className={`${ADVANCED_SORT_PRE_CLS}-custom-form`}
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
              <Form.Item key={field}>
                <Form.Item name={[field, 'name']} initialValue={name} noStyle>
                  <Select
                    className={`${ADVANCED_SORT_PRE_CLS}-select`}
                    size="small"
                  />
                </Form.Item>
                <span className={`${ADVANCED_SORT_PRE_CLS}-field-prefix`}>
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
                  {({ getFieldValue }) =>
                    !isEqual(getFieldValue([field, 'rule']), ['sortBy']) ? (
                      <Form.Item
                        shouldUpdate
                        noStyle
                        name={[field, 'sortMethod']}
                        initialValue={toUpper(sortMethod) || 'ASC'}
                      >
                        <Radio.Group
                          className={`${ADVANCED_SORT_PRE_CLS}-rule-end`}
                        >
                          {map(SORT_METHOD, (i) => (
                            <Radio value={i.value} key={i.value}>
                              {i.name}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    ) : (
                      <>
                        <a
                          className={`${ADVANCED_SORT_PRE_CLS}-rule-end`}
                          onClick={() => {
                            handleCustomSort(
                              item as unknown as Dimension,
                              currentSortBy,
                            );
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
                    )
                  }
                </Form.Item>
                <DeleteOutlined
                  className={`${ADVANCED_SORT_PRE_CLS}-rule-end-delete`}
                  onClick={() => {
                    deleteRule(item as unknown as Dimension);
                  }}
                />
              </Form.Item>
            );
          })}
        </Form>
      </Content>
    );

    useEffect(() => {
      if (isSortVisible) {
        const initRuleList = getRuleList();
        const manualDimensions = getManualDimensionList();
        const initDimensionList = getDimensionList(
          manualDimensions,
        ) as Dimension[];
        const initRuleOptions = getRuleOptions() as unknown as RuleItem[];

        setRuleList(initRuleList);
        setManualDimensionList(manualDimensions);
        setDimensionList(initDimensionList);
        setRules(initRuleOptions);
      }
    }, [isSortVisible]);

    return (
      <div className={cx(ADVANCED_SORT_PRE_CLS, className)}>
        <Button
          onClick={sortClick}
          icon={icon || <SortIcon />}
          size="small"
          className={`${ADVANCED_SORT_PRE_CLS}-btn`}
        >
          {text || i18n('高级排序')}
        </Button>
        <Modal
          title={text || i18n('高级排序')}
          open={isSortVisible}
          onOk={onFinish}
          onCancel={handleModal}
          okText={i18n('确定')}
          cancelText={i18n('取消')}
          destroyOnClose
          className={`${ADVANCED_SORT_PRE_CLS}-modal`}
        >
          <Layout>
            {renderSide()}
            {renderContent()}
          </Layout>
        </Modal>
        <Modal
          title={i18n('手动排序')}
          open={isCustomVisible}
          onOk={customSort}
          onCancel={customCancel}
          okText={i18n('确定')}
          cancelText={i18n('取消')}
          destroyOnClose
          className={`${ADVANCED_SORT_PRE_CLS}-custom-modal`}
        >
          <CustomSort splitOrders={sortBy} setSplitOrders={setSortBy} />
        </Modal>
      </div>
    );
  },
);

AdvancedSort.displayName = 'AdvancedSort';
