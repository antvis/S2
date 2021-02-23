import * as _ from 'lodash';
import * as React from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { HtmlIcon } from '../../icons';
import { OperationProps, OperationState } from '../interface';

const CONTAINER_CLASS = 'eva-facet-tooltip-operation';
interface OrderOption {
  sortMethod: 'ASC' | 'DESC';
  type: 'globalAsc' | 'globalDesc' | 'groupAsc' | 'groupDesc' | 'none';
  name: string;
}
const ORDER_OPTIONS: OrderOption[] = [
  { sortMethod: 'ASC', type: 'groupAsc', name: '组内升序' },
  { sortMethod: 'DESC', type: 'groupDesc', name: '组内降序' },
  { sortMethod: null, type: 'none', name: '不排序' },
];

export class TooltipOperation extends React.PureComponent<
  OperationProps,
  OperationState
> {
  state = {
    sortParam: this.props.plot.store.get('sortParam'),
  };

  constructor(props) {
    super(props);
  }

  handleSelectOrder = ({ key: type }) => {
    const { plot, sortFieldId, sortQuery } = this.props;
    // 刷新数据
    const selectedOption = _.find(ORDER_OPTIONS, { type }) as OrderOption;
    const sortParam =
      type === 'none'
        ? null
        : {
            type,
            sortFieldId,
            sortMethod: _.get(selectedOption, 'sortMethod'),
            query: sortQuery,
          };
    // 排序条件，存到 store 中
    plot.store.set('sortParam', sortParam);
    if ('setDataCfg' in plot) {
      const dataCfg = { ...plot.dataCfg };
      // 手动排序的优先级高于全局配置
      dataCfg.sortParams = [].concat(sortParam || [], dataCfg.sortParams);
      // 声控编程 by lqs
      // 内部更新排序规则，直接使用dataset方法
      plot.dataSet.setDataCfg(dataCfg);
      // 手动重新渲染，不触发plot的setDataCfg流程
      plot.render(false);

      this.setState({ sortParam });
    }
  };

  getSortSelection = () => {
    const { plot, sortFieldId, sortQuery } = this.props;
    // const sortParam = plot.store.get('sortParam');
    const sortParam = this.state.sortParam;
    let selectedSortMethod = null;
    if (sortParam && _.isEqual(_.get(sortParam, 'query'), sortQuery)) {
      selectedSortMethod = _.get(sortParam, 'sortMethod', null);
    }
    const selectedSortOption = _.find(ORDER_OPTIONS, {
      sortMethod: selectedSortMethod,
    });
    const selectedSortName = _.get(selectedSortOption, 'name');
    const htmlIconProps = {
      width: 14,
      height: 14,
      style: {
        verticalAlign: 'sub',
        marginRight: 4,
      },
    };
    const menu = (
      <Menu
        selectedKeys={[selectedSortMethod]}
        onClick={this.handleSelectOrder}
      >
        {ORDER_OPTIONS.map((o: OrderOption) => {
          return (
            <Menu.Item className="operation-item" key={o.type}>
              <HtmlIcon type={o.type} {...htmlIconProps} />
              {o.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <span className="operation-button">
          {selectedSortName} <DownOutlined type="down" />
        </span>
      </Dropdown>
    );
  };

  render(): JSX.Element {
    return (
      <div className={CONTAINER_CLASS}>
        {/* <span className="operation-button">仅显示</span> */}
        {/* <span className="operation-button">排除</span> */}
        {this.getSortSelection()}
        {/* <span className="operation-button"><Icon type="table" /></span> */}
      </div>
    );

    return null;
  }
}
