import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Modal,
  Button,
  Card,
  Layout,
  Select,
  Radio,
  Form,
  Cascader,
  Switch,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { act } from 'react-dom/test-utils';
import { isEqual, keys, forEach } from 'lodash';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SortParam,
  defaultOptions,
  TOTAL_VALUE,
} from '../../src';
import { getContainer } from '../util/helpers';
import {
  originData,
  totalData,
  meta,
  fields,
  demissions,
  ruleOptions,
  methodList,
} from '../data/data-sort.json';
import { HtmlIcon } from '@/common/icons';
import 'antd/dist/antd.min.css';
import './less/sort-sheet-spec.less';

const { Sider, Content } = Layout;

function MainLayout() {
  const [isTotals, setIsTotals] = useState(true);
  const [options, setMergedOptions] = useState<S2Options>({
    ...defaultOptions,
    width: 880,
    height: 600,
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['province'],
      },
      col: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['type'],
      },
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCustomVisible, setIsCustomVisible] = useState(false);
  const [ruleList, setRuleList] = useState([]);
  const [demissionList, setDemissionList] = useState(demissions);
  const [splitOrders, setSplitOrders] = useState([]);
  const [currentDemission, setCurrentDemission] = useState<{
    field: string;
    name: string;
    list: string[];
  }>();
  const [dataCfg, setDataCfg] = useState<S2DataConfig>({
    fields: {
      ...fields,
      valueInCols: true,
    },
    meta,
    data: originData,
    totalData,
  });
  const [form] = Form.useForm();

  const handleTotal = () => {
    setMergedOptions({
      ...options,
      width: 800,
      totals: {
        row: {
          ...options?.totals?.row,
          showGrandTotals: !isTotals,
          showSubTotals: !isTotals,
        },
        col: {
          ...options?.totals?.col,
          showGrandTotals: !isTotals,
          showSubTotals: !isTotals,
        },
      },
    });
    setIsTotals(!isTotals);
  };
  const handleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleCustom = () => {
    setIsCustomVisible(!isCustomVisible);
  };
  const handleDemission = (demission) => {
    if (!ruleList?.find((item) => item?.field === demission?.field)) {
      setCurrentDemission(demission);
      setRuleList([...ruleList, demission]);
    }
    setDemissionList(
      demissionList?.filter((item) => item?.field !== demission.field),
    );
  };
  const handleCustomSort = (demission) => {
    handleCustom();
    setSplitOrders(
      demissions.find((item) => item.field === demission.field)?.list || [],
    );
  };
  const uphandler = (value) => {
    const res = splitOrders.concat();
    res.splice(res.indexOf(value), 1);
    res.unshift(value);
    setSplitOrders(res);
  };
  const downHandler = (value) => {
    const res = splitOrders.concat();
    let index = res.indexOf(value);
    res.splice(res.indexOf(value), 1);
    res.splice(++index, 0, value);
    setSplitOrders(res);
  };
  const toTopHandler = (value) => {
    const res = splitOrders.concat();
    let index = res.indexOf(value);
    if (index > 0) {
      res.splice(res.indexOf(value), 1);
      res.splice(--index, 0, value);
      setSplitOrders(res);
    }
  };
  const customSort = () => {
    handleCustom();
    form.getFieldValue(currentDemission?.field).splitOrders = splitOrders;
  };
  const deleteRule = (demission) => {
    setRuleList(ruleList?.filter((item) => item?.field !== demission?.field));
    setDemissionList([...demissionList, demission]);
  };
  const onFinish = () => {
    const ruleValue = form.getFieldsValue();
    const sortParams = [];
    forEach(keys(ruleValue), (item) => {
      const { method, rule, splitOrders } = ruleValue[item];
      const current: SortParam = { sortFieldId: item };
      if (rule[0] === 'sortByMeasure') {
        if (item !== 'city') {
          current.sortByMeasure = TOTAL_VALUE;
        } else {
          current.sortByMeasure = rule[1];
        }
        current.sortMethod = method;
        current.query = {
          $$extra$$: 'cost',
        };
      } else if (rule[0] === 'sortBy') {
        current.sortBy = splitOrders;
      } else {
        current.sortMethod = method;
      }
      sortParams.push(current);
    });
    setDataCfg({ ...dataCfg, sortParams });
    handleModal();
  };

  const renderItem = (value, index) => {
    return (
      <li key={index} className="split-value" title={value}>
        <span className="split-text">{value}</span>
        <span
          className="split-icon"
          onClick={() => {
            uphandler(value);
          }}
        >
          <HtmlIcon type="groupAsc" width={14} height={14} />
        </span>
        <span
          className="split-icon"
          onClick={() => {
            downHandler(value);
          }}
        >
          <HtmlIcon type="groupDesc" width={14} height={14} />
        </span>
        <span
          className="split-icon"
          onClick={() => {
            toTopHandler(value);
          }}
        >
          <HtmlIcon type="globalAsc" width={14} height={14} />
        </span>
      </li>
    );
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Switch
          checkedChildren="显示小计"
          unCheckedChildren="不显示小计"
          checked={isTotals}
          onChange={handleTotal}
          style={{ marginRight: 10 }}
        />
        <Button onClick={handleModal} size="small" style={{ fontSize: 12 }}>
          高级排序
        </Button>
        <span
          style={{ fontSize: 12, color: 'rgb(247, 106, 36)', marginLeft: 10 }}
        >
          组内排序优先级高于高级排序
        </span>
      </div>
      <Modal
        title="高级排序"
        visible={isModalVisible}
        onOk={onFinish}
        onCancel={handleModal}
        okText="确定"
        cancelText="取消"
        style={{ minWidth: 640 }}
      >
        <Layout>
          <Sider width={120} className="sider-layout">
            <div className="title">可选字段</div>
            <div>
              {demissionList.map((item) => {
                return (
                  <div
                    className="demission-item"
                    key={item.field}
                    onClick={() => {
                      handleDemission(item);
                    }}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
          </Sider>
          <Content className="content-layout">
            <div className="title">按以下规则进行排序(优先级由低到高)</div>
            <Form form={form} name="form" className="custom-form">
              {ruleList?.map((item) => {
                return (
                  <Form.Item name={item.field} key={item.field}>
                    <Form.Item
                      name={[item.field, 'name']}
                      initialValue={item.name}
                      noStyle
                    >
                      <Select style={{ width: 120 }} size="small" />
                    </Form.Item>
                    <span className="field-prefix">按</span>
                    <Form.Item
                      name={[item.field, 'rule']}
                      initialValue={['method']}
                      noStyle
                    >
                      <Cascader
                        options={ruleOptions}
                        expandTrigger="hover"
                        size="small"
                        style={{ width: 120 }}
                      />
                    </Form.Item>
                    <Form.Item shouldUpdate noStyle>
                      {({ getFieldValue }) => {
                        return !isEqual(getFieldValue([item.field, 'rule']), [
                          'sortBy',
                        ]) ? (
                          <Form.Item
                            shouldUpdate
                            noStyle
                            name={[item.field, 'method']}
                            initialValue={'asc'}
                          >
                            <Radio.Group className="rule-end">
                              {methodList?.map((i) => {
                                return (
                                  <Radio value={i.value} key={i.value}>
                                    {i.name}
                                  </Radio>
                                );
                              })}
                            </Radio.Group>
                          </Form.Item>
                        ) : (
                          <a
                            className="rule-end"
                            onClick={() => {
                              handleCustomSort(item);
                            }}
                          >
                            设置顺序
                          </a>
                        );
                      }}
                    </Form.Item>
                    <DeleteOutlined
                      className="rule-end-delete"
                      onClick={() => {
                        deleteRule(item);
                      }}
                    />
                  </Form.Item>
                );
              })}
            </Form>
          </Content>
        </Layout>
      </Modal>
      <Modal
        title="手动排序"
        visible={isCustomVisible}
        onOk={customSort}
        onCancel={handleCustom}
        okText="确定"
        cancelText="取消"
      >
        <Card className="card-content">
          {splitOrders?.map((item, index) => {
            return renderItem(item, index);
          })}
        </Card>
      </Modal>
      <SheetComponent
        dataCfg={dataCfg}
        options={options}
        adaptive={false}
        themeCfg={{ name: 'simple' }}
      />
    </>
  );
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});
