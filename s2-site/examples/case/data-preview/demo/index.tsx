/* eslint-disable max-classes-per-file */
import React, { useState, useEffect, useRef } from 'react';

import insertCSS from 'insert-css';
import { Polygon } from '@antv/g';
import {
  TableColCell,
  GuiIcon,
  TableCornerCell,
  S2Event,
  InteractionStateName,
  CellType,
  S2DataConfig,
} from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import {
  Input,
  Divider,
  Space,
  Button,
  Modal,
  Radio,
  Form,
  Popover,
  Checkbox,
  message,
} from 'antd';
import { get, uniq } from 'lodash';
import '@antv/s2-react/dist/style.min.css';

const { Search } = Input;

const initColumns = ['province', 'city', 'type', 'price'];

const iconMap = {
  none: 'Filter',
  asc: 'SortUp',
  desc: 'SortDown',
};

const filterIcon =
  '<svg t="1633848048963" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="85936" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M0 0h1024L724.676923 488.369231V1024l-425.353846-141.784615v-393.846154L0 0z m196.923077 102.4l204.8 354.461538v362.338462l228.430769 63.015385V456.861538l212.676923-354.461538H196.923077z" opacity=".4" p-id="85937"></path></svg>';

const sortUp =
  '<svg t="1634734477742" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2208" width="200" height="200"><path d="M569.508769 653.352619l151.594419 0 0 108.819221-151.594419 0L569.508769 653.352619zM569.508769 65.693452l385.479045 0 0 108.828814L569.508569 174.522266 569.508769 65.693452 569.508769 65.693452zM569.508769 261.583239l307.513506 0 0 108.819021L569.508769 370.402259 569.508769 261.583239 569.508769 261.583239zM569.508769 457.463032l229.552363 0 0 108.821019-229.552363 0C569.508769 566.284051 569.508769 457.463032 569.508769 457.463032zM569.508769 849.232612l73.62868 0 0 108.826815-73.62868 0L569.508769 849.232612zM354.693414 427.846912l0 530.212516L203.94622 958.059428 203.94622 427.846912 62.754748 427.846912 279.308125 65.187795 495.87849 427.846912 354.693414 427.846912z" p-id="2209"></path></svg>';

const sortDown =
  '<svg t="1634734501800" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2875" width="200" height="200"><path d="M279.15323 958.059228l217.110799-363.160177-141.539436 0L354.724593 63.957829l-151.123938 0 0 530.943021L62.057421 594.900849 279.15323 958.059228 279.15323 958.059228zM570.078783 64.464885l386.443791 0 0 108.976114L570.078583 173.440999 570.078783 64.464885 570.078783 64.464885zM570.078783 369.594007 878.364965 369.594007l0-108.974515L570.078783 260.619492 570.078783 369.594007zM570.078783 565.747016l230.128573 0 0-108.976114L570.078783 456.770901 570.078783 565.747016 570.078783 565.747016zM570.078783 761.904621l151.972163 0L722.050945 652.930305l-151.972163 0L570.078783 761.904621zM570.078783 958.059228l73.813355 0 0-108.974315-73.813355 0L570.078783 958.059228z" p-id="2876"></path></svg>';

const ShowList = ({ columns, setColumns, allChecked }) => {
  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      title={
        <div>
          <Checkbox
            checked={allChecked}
            onChange={() =>
              allChecked ? setColumns([]) : setColumns([...initColumns])
            }
          >
            全选 {columns.length} / {initColumns.length}
          </Checkbox>
        </div>
      }
      content={initColumns.map((e, i) => (
        <div key={e}>
          <Checkbox
            checked={columns.includes(e)}
            onChange={() =>
              columns.includes(e)
                ? setColumns((fields) => fields.filter((item) => e !== item))
                : setColumns((fields) => [...fields, e])
            }
          >
            {e}
          </Checkbox>
        </div>
      ))}
    >
      <Button>隐藏列</Button>
    </Popover>
  );
};

class CustomCornerCell extends TableCornerCell {
  drawBackgroundShape() {
    super.drawBackgroundShape();
  }

  drawInteractiveBgShape() {
    super.drawInteractiveBgShape();
  }

  drawTextShape() {
    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    const padding = 4;

    this.appendChild(
      new Polygon({
        zIndex: 4,
        style: {
          fill: 'rgba(0,0,0,0.1)',
          points: [
            [x + cellWidth - padding + 2, y + padding],
            [x + cellWidth - padding + 2, y + cellHeight - padding],
            [
              x + cellWidth - padding - cellHeight + padding * 2,
              y + cellHeight - padding,
            ],
          ],
        },
      }),
    );
  }
}

class CustomTableColCell extends TableColCell {
  onIconClick;

  constructor(meta, spreadsheet, headerConfig, callback) {
    super(meta, spreadsheet, headerConfig);
    this.onIconClick = callback;
  }

  drawTextShape() {
    super.drawTextShape();

    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    const style = this.getStyle();
    const iconSize = get(style, 'icon.size');
    const iconMargin = get(style, 'icon.margin');

    const iconX = x + cellWidth - iconSize - iconMargin?.right;
    const iconY = y + cellHeight / 2 - iconSize / 2;

    this.renderFilterIcon({
      x: iconX,
      y: iconY,
      width: iconSize,
      height: iconSize,
    });
  }

  renderFilterIcon(position) {
    const sortMethod = getCurrentSortMethod(
      this.meta.value,
      this.spreadsheet.dataCfg.sortParams,
    );

    /**
     * 有值说明有加filter
     */
    const isFiltered = !!getCurrentFilterParams(
      this.meta.value,
      this.spreadsheet.dataCfg.filterParams,
    ).length;

    const { x, y, width, height } = position;
    const icon = new GuiIcon({
      name: iconMap[sortMethod.toLowerCase()],
      x,
      y,
      width,
      height,
      fill: isFiltered ? '#873bf4' : 'rgb(67, 72, 91)',
    });

    this.appendChild(icon);
    // this.add(icon);

    icon.addEventListener('click', () => {
      this.onIconClick?.({
        meta: this.meta,
      });
    });
  }
}

const getSearchResult = (searchKey, data, columns) => {
  if (!searchKey) {
    return [];
  }

  const results = [];

  data.forEach((row, rowId) => {
    columns.forEach((col, colId) => {
      if (
        (`${row[col]}` || '').toLowerCase().includes(searchKey.toLowerCase())
      ) {
        results.push({
          col: colId,
          row: rowId,
        });
      }
    });
  });

  return results;
};

const scrollToCell = (rowIndex, colIndex, options, facet, interaction) => {
  const { rowCount: frozenRowCount } = options.frozen;
  const colsNodes = facet.getColLeafNodes();

  let offsetX = 0;
  let offsetY = 0;

  offsetY = facet.viewCellHeights.getCellOffsetY(rowIndex - 1);
  offsetX = colsNodes.find((item) => item.colIndex === colIndex)?.x;
  if (frozenRowCount > 0 && rowIndex > frozenRowCount - 1) {
    offsetY -= facet.getTotalHeightForRange(0, frozenRowCount - 1);
  }

  if (offsetY < 0) {
    offsetY = 0;
  }

  facet.scrollWithAnimation({
    offsetX: {
      value: offsetX,
    },
    offsetY: {
      value: offsetY,
    },
  });

  interaction.changeState({
    stateName: InteractionStateName.SELECTED,
    cells: [
      {
        colIndex,
        rowIndex,
        id: `${String(rowIndex)}-${colsNodes[colIndex + 1].id}`,
        type: CellType.DATA_CELL,
      },
    ],
  });
};

const App = ({ data }) => {
  const s2Ref = useRef(null);
  const [columns, setColumns] = React.useState(initColumns);
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [colModalVisible, setColModalVisible] = useState(false);
  const [searchResultActiveIndex, setSearchResultActiveIndex] = useState(-1);
  const [form] = Form.useForm();
  const [interactedCol, setInteractedCol] = useState('');
  const modalCallbackRef = useRef((e) => {});

  const onIconClick = ({ meta }) => {
    setInteractedCol(meta.value);
    setColModalVisible(!colModalVisible);
  };

  const options: SheetComponentOptions = {
    width: 600,
    height: 400,
    seriesNumber: {
      enable: true
    },
    interaction: {
      copy: { enable: true },
      autoResetSheetStyle: false,
      hoverFocus: false,
    },
    colCell: (item, spreadsheet, headerConfig) => {
      if (item.colIndex === 0) {
        return new CustomCornerCell(item, spreadsheet, headerConfig);
      }

      return new CustomTableColCell(
        item,
        spreadsheet,
        headerConfig,
        onIconClick,
      );
    },
    customSVGIcons: [
      {
        name: 'Filter',
        svg: filterIcon,
      },
      {
        name: 'SortUp',
        svg: sortUp,
      },
      {
        name: 'SortDown',
        svg: sortDown,
      },
    ],
    tooltip: {
      operation: {
        hiddenColumns: true,
      },
    },
    showDefaultHeaderActionIcon: false,
  };

  const [dataCfg, setDataCfg] = useState<S2DataConfig>({
    fields: {
      columns,
    },
    data,
    sortParams: [],
    filterParams: [],
  });

  useEffect(() => {
    setDataCfg((cfg) => ({
      ...cfg,
      fields: { columns },
    }));

    s2Ref.current?.render();
  }, [columns.length]);

  const allChecked = columns.length === initColumns.length;

  const focusNext = (results, currentIndex) => {
    const length = results.length;
    let nextIndex = currentIndex + 1;

    if (nextIndex >= length) {
      nextIndex = 0;
    }

    setSearchResultActiveIndex(nextIndex);
    const current = results[nextIndex];

    if (!current) {
      return;
    }

    scrollToCell(
      current.row,
      current.col,
      s2Ref.current.options,
      s2Ref.current.facet,
      s2Ref.current.interaction,
    );
  };

  const focusPrev = (results) => {
    const length = results.length;
    let nextIndex = searchResultActiveIndex - 1;

    if (nextIndex < 0) {
      nextIndex = length - 1;
    }

    setSearchResultActiveIndex(nextIndex);
    const current = results[nextIndex];

    if (!current) {
      return;
    }

    scrollToCell(
      current.row,
      current.col,
      s2Ref.current.options,
      s2Ref.current.facet,
      s2Ref.current.interaction,
    );
  };

  const search = (key) => {
    let searchData = [];

    if (s2Ref.current) {
      searchData = s2Ref.current.dataSet.getDisplayDataSet();
    }

    const results = getSearchResult(key, searchData, columns);

    setSearchResult(results);
    setSearchResultActiveIndex(-1);
    if (results.length > 0) {
      focusNext(results, -1);
    }
  };

  return (
    <div>
      <Space>
        <ShowList
          columns={columns}
          allChecked={allChecked}
          setColumns={setColumns}
        />
        <Search
          placeholder="输入关键词搜索"
          allowClear
          enterButton="Search"
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
          onSearch={(key) => {
            search(key);
          }}
        />

        {searchResult.length ? (
          <>
            <div>{`${searchResultActiveIndex + 1}/${
              searchResult.length + 1
            }`}</div>
            <Button
              shape="circle"
              icon={<antdIcons.ArrowLeftOutlined />}
              onClick={() => {
                if (searchResult.length > 0) {
                  focusPrev(searchResult);
                }
              }}
            />
            <Button
              shape="circle"
              icon={<antdIcons.ArrowRightOutlined />}
              onClick={() => {
                if (searchResult.length > 0) {
                  focusNext(searchResult, searchResultActiveIndex);
                }
              }}
            />
          </>
        ) : null}
      </Space>

      <Divider />
      <SheetComponent
        ref={s2Ref}
        dataCfg={dataCfg}
        options={options}
        sheetType="table"
        onColCellClick={({ event, viewMeta }) => {
          // 最左侧列的格子点击后全选
          if (viewMeta?.colIndex === 0) {
            s2Ref.current?.interaction.selectAll();
          }
        }}
        onCopied={() => {
          message.success('复制成功');
        }}
      />
      <Modal
        title="列设置"
        open={colModalVisible}
        className="antv-s2-data-preview-demo-modal"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setColModalVisible(false);
          form.resetFields();
        }}
        onOk={() => {
          modalCallbackRef.current();
          setColModalVisible(false);
        }}
      >
        <SortPopover
          spreadsheet={s2Ref.current}
          fieldName={interactedCol}
          modalCallbackRef={modalCallbackRef}
        />
      </Modal>
    </div>
  );
};

function convertToObject(values) {
  const initData = {};

  values.forEach((val) => {
    initData[val] = true;
  });

  return initData;
}

function getCurrentSortMethod(fieldName, sortParams) {
  return (
    get(
      (sortParams || []).filter((param) => param.sortFieldId === fieldName),
      '[0].sortMethod',
      'NONE',
    ) || 'NONE'
  );
}

function getCurrentFilterParams(fieldName, filterParams) {
  const filtered = get(
    (filterParams || []).filter((param) => param.filterKey === fieldName),
    '[0].filteredValues',
    [],
  );

  return filtered;
}

function SortPopover({ fieldName, spreadsheet, modalCallbackRef }) {
  const fieldData = React.useMemo(
    () =>
      uniq(
        // slice掉第一行  （第一行是column名）
        spreadsheet.dataSet.originData.slice(1).map((item) => item[fieldName]),
      ),
    [spreadsheet.dataSet.originData, fieldName],
  );

  const { sortParams, filterParams } = spreadsheet.dataCfg;
  const [sort, setSort] = React.useState(
    getCurrentSortMethod(fieldName, sortParams),
  );
  const [filtered, setFiltered] = React.useState(
    convertToObject(getCurrentFilterParams(fieldName, filterParams)),
  );
  const [changed, setChanged] = React.useState({
    sort: false,
    filter: false,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const searchedFieldData = React.useMemo(
    () =>
      fieldData.filter((data) => {
        if (searchKeyword) {
          if (typeof data === 'string') {
            return data.search(searchKeyword) !== -1;
          }

          return false;
        }

        return true;
      }),
    [searchKeyword, fieldData],
  );

  const onKeywordChange = (keyword) => {
    // 关键词变化时将不在关键词内的值过滤
    setSearchKeyword(keyword);
    setChanged((old) => ({ ...old, filter: true }));
    const newFilter = {};

    fieldData
      .filter(
        (data) =>
          !fieldData
            .filter((field) => {
              if (keyword) {
                if (typeof field === 'string') {
                  return field.search(keyword) !== -1;
                }

                return false;
              }

              return true;
            })
            .includes(data),
      )
      .forEach((data) => {
        newFilter[data] = true;
      });
    setFiltered(newFilter);
  };

  modalCallbackRef.current = () => {
    if (changed.sort) {
      spreadsheet.emit(S2Event.RANGE_SORT, [
        {
          sortFieldId: fieldName,
          sortMethod: sort,
        },
      ]);
    }

    if (changed.filter) {
      spreadsheet.emit(S2Event.RANGE_FILTER, {
        filterKey: fieldName,
        // 将Object还原成数组
        filteredValues: Object.entries(filtered)
          .map(([fieldValue, isFiltered]) => {
            if (isFiltered) {
              return fieldValue;
            }
          })
          .filter(Boolean),
      });
    }

    setChanged({ filter: false, sort: false });
  };

  return (
    <Form
      style={{ padding: '1em' }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <Form.Item label="数据排序: " className="sort-item">
        <Radio.Group
          onChange={(e) => {
            setSort(e.target.value);
            setChanged((val) => ({ ...val, sort: true }));
          }}
          value={sort}
        >
          <Radio value={'NONE'}>无</Radio>
          <Radio value={'ASC'}>升序</Radio>
          <Radio value={'DESC'}>降序</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="数值筛选: " className="filter-item">
        <div>
          <Input.Search
            value={searchKeyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="请输入搜索关键词"
            className="search-box"
          />
          <div className="check-item-list">
            <Checkbox
              className="check-item"
              checked={searchedFieldData.every(
                (fieldValue) => !filtered[fieldValue],
              )}
              indeterminate={
                searchedFieldData.some((fieldValue) => !filtered[fieldValue]) &&
                !searchedFieldData.every((fieldValue) => !filtered[fieldValue])
              }
              onChange={(e) => {
                const {
                  target: { checked },
                } = e;

                setChanged((val) => ({ ...val, filter: true }));

                if (checked) {
                  setFiltered((old) => {
                    const newValue = {};

                    searchedFieldData.forEach((fieldValue) => {
                      newValue[fieldValue] = false;
                    });

                    return newValue;
                  });
                } else {
                  // 将全部过滤
                  setFiltered((old) => {
                    const newValue = {};

                    searchedFieldData.forEach((fieldValue) => {
                      newValue[fieldValue] = true;
                    });

                    return newValue;
                  });
                }
              }}
            >
              全选
            </Checkbox>

            {searchedFieldData.map((item, i) => {
              return (
                <Checkbox
                  key={i}
                  className="check-item"
                  checked={!filtered[item]}
                  onChange={(e) => {
                    setChanged((old) => ({ ...old, filter: true }));
                    setFiltered((old) => ({
                      ...old,
                      [item]: !e.target.checked,
                    }));
                  }}
                >
                  {item}
                </Checkbox>
              );
            })}
          </div>
        </div>
      </Form.Item>
    </Form>
  );
}

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App data={res} />);
  });

insertCSS(`
  .antv-s2-data-preview-demo-modal .filter-item {
    margin-top: 20px;
  }

  .antv-s2-data-preview-demo-modal .check-item-list {
    display: flex;
    flex-direction: column;
  }

  .ant-checkbox-wrapper.check-item {
    margin-left: 0;
  }

  .ant-checkbox-wrapper .ant-modal-close-x {
    width: auto;
    height: auto;
  }

  .antv-s2-data-preview-demo-modal .search-box {
    margin-bottom: 5px
  }
`);
