import {
  get,
  find,
  merge,
  sortBy,
  map,
  set,
  reduce,
  slice,
  last,
  isEqual,
  keys,
  head,
  filter,
  each,
  isArray,
} from 'lodash';
import { BaseFacet } from '../../index';
import { ColWidthCache, SpreadSheetFacetCfg } from '../../../common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import checkHideMeasureColumn from './check-hide-measure-column';
import getColHeight from './get-col-height';
import getColMaxTextWidth from './get-col-max-text-width';
import getColWidth from './get-col-width';
import { getDimsConditionByNode } from './index';
import {
  STRATEGY_PADDING,
  STRATEGY_ICON_WIDTH,
} from '../../../common/constant';
import handleLayoutHook from './handle-layout-hook';
import { WidthType } from './process-default-col-width-by-type';
import { KEY_COL_REAL_WIDTH_INFO, measureTextWidth } from '../../../index';

/**
 * 行头有维度
 * 此时行头是按照行头维度展开
 * 当前每一列的数据是由小计+度量组成的
 */
const colWidthHasRows = (
  cfg: SpreadSheetFacetCfg,
  node: Node,
  facet: BaseFacet,
) => {
  const derivedValues = cfg.derivedValues || [];
  // 业务上层业务中，目前所有需要被展示的衍生指标的个数都是相等的，
  // 因此不需要单独去找所谓的最大的衍生指标个数
  const displayDerivedValueFieldColumn = [];
  const maxDisplayLength =
    head(derivedValues)?.displayDerivedValueField?.length || 0;
  const allDisplayDerivedValueField = derivedValues.map(
    (dv) => dv.displayDerivedValueField,
  );
  for (let i = 0; i < maxDisplayLength; i++) {
    displayDerivedValueFieldColumn.push(
      allDisplayDerivedValueField.map((ddv) => ddv[i]),
    );
  }
  const dataset = cfg.dataSet;
  // 存在当列信息的数据集合（这里是原始数据）
  const records = dataset.getCellData(getDimsConditionByNode(node));
  // 还需要找到该列存在的小计值
  const totalData = filter(facet.spreadsheet.dataCfg.totalData, (td) => {
    const query = node.query;
    let isAllContains = true;
    each(keys(query), (key) => {
      if (!isEqual(query[key], td[key])) {
        isAllContains = false;
      }
    });
    return isAllContains;
  });

  const { values } = cfg.spreadsheet.dataCfg.fields;
  const measures = values as string[];

  // 小计10个，明细数据30个（默认）
  const {
    totalSample,
    detailSample,
    maxSampleIndex,
  } = cfg.spreadsheet.options.style.colCfg;
  const getSecondLast = (data) => {
    if (isArray(data)) {
      if (data?.length > maxSampleIndex) {
        return get(data, data?.length - maxSampleIndex);
      }
      return get(data, 0, '');
    }
    return '';
  };
  const sample = [
    ...slice(totalData, 0, totalSample),
    ...slice(records, 0, detailSample),
  ];
  // 数据中可能存在直接 数值，需要转换 为字符 + ''
  const maxText = (vs: string[]) => {
    const sorted = sortBy(
      sample.map((record) => {
        // 每个数据 是找所有度量格式化后的最大值
        const single = sortBy(
          vs.map((ms) => {
            const formatter = dataset.getFieldFormatter(ms);
            return formatter(record[ms] === undefined ? '' : record[ms]);
          }),
          (m) => (m + '').length,
        );
        return getSecondLast(single);
      }),
      (m) => (m + '').length,
    );
    return getSecondLast(sorted);
  };

  // 找到该列所有度量 在前*个数据中主指标的最大label
  const maxMainTextInCol = maxText(measures);
  // 每个衍生指标列对应的最大文本
  const maxDerivedTextInCol = displayDerivedValueFieldColumn.map(
    (columnValue) => maxText([...columnValue]),
  );
  return {
    maxMainTextInCol,
    maxDerivedTextInCol,
  };
};

/**
 * 行头无维度
 * 此时行头是按照指标树目录结构展开，当前每一列的数据是由单纯的度量本身组成
 * 原始数据是以列的形式返回，也就是 dataCfg.data 每个元素代表一列数据
 * 该列所有的指标和衍生指标都存放在单个元素中
 */
const colWidthNoRows = (cfg: SpreadSheetFacetCfg, node: Node) => {
  const records = cfg.spreadsheet.dataCfg.data;
  const dataset = cfg.dataSet;
  const currentColData = find(records, (td) => {
    const query = node.query;
    let isAllContains = true;
    each(keys(query), (key) => {
      if (!isEqual(query[key], td[key])) {
        isAllContains = false;
      }
    });
    return isAllContains;
  });
  const { values } = cfg.spreadsheet.dataCfg.fields;
  const measures = get(values, 'measures', []);
  const { detailSample } = cfg.spreadsheet.options.style.colCfg;

  const maxText = (vs: string[]) => {
    // 1、筛选前N个
    const sample = slice(vs, 0, detailSample) as string[];
    // 2、计算前N个格式化后的长度
    const topText = sample.map((s) => {
      // 防止是Number导致宽度计算为0
      const v = currentColData[s] + '';
      const formatter = dataset.getFieldFormatter(s);
      return formatter(v === undefined ? '' : v);
    });
    // 3、按字符长度排序
    const orderedText = sortBy(topText, (tm) => (tm + '').length);
    // 4、获取最大的字符
    return last(orderedText);
  };

  // 主指标的宽度
  const maxMainTextInCol = maxText(measures);

  // 衍生指标列最大的值
  const derivedValues = cfg.derivedValues;
  // 每个类型的衍生指标对应一列
  const maxDerivedTextInCol = [];
  // 最大的衍生指标个数，说明有几列
  const maxDisplayLength =
    head(derivedValues)?.displayDerivedValueField?.length || 0;
  const allDisplayDerivedValueField = derivedValues.map(
    (dv) => dv.displayDerivedValueField,
  );
  for (let i = 0; i < maxDisplayLength; i++) {
    const singleDerivedColMeasures = allDisplayDerivedValueField.map(
      (ddv) => ddv[i],
    );
    const singleText = maxText(singleDerivedColMeasures);
    maxDerivedTextInCol.push(singleText);
  }
  return {
    maxMainTextInCol,
    maxDerivedTextInCol,
  };
};

const getColWidthWithDerivedValue = (
  cfg: SpreadSheetFacetCfg,
  node: Node,
  facet: BaseFacet,
) => {
  const cacheInfos = cfg.spreadsheet.store.get(KEY_COL_REAL_WIDTH_INFO);
  const widthCacheKey = `${JSON.stringify(node.query)}-width`;
  const cacheWidth = get(cacheInfos, `realWidth.${widthCacheKey}`, null);
  const lastUserDragWidth = get(
    cacheInfos,
    `lastUserDragWidth.${node.value}`,
    null,
  );
  const { cellCfg, colCfg } = cfg;
  const dragHappened = lastUserDragWidth !== getColWidth(node, colCfg, cellCfg);
  if (cacheWidth && !dragHappened) {
    // 有缓存直接用, 且不是拖拽发生的layout
    return cacheWidth;
  }
  // cell宽度计算
  let width;
  /**
   * 主指标和衍生指标的展示分为两个场景
   * 1、省略展示
   *  - - - - - - - - - - - - - - - - - - - - - - -
   * |8px|主指标宽度|12px|衍生指标宽度|8px|...宽度|8px|
   *  - - - - - - - - - - - - - - - - - - - - - - -
   * 2、平铺展示
   *  - - - - - - - - - - - - - - - - - - - - - -
   * |8px|主指标宽度|12px|(衍生指标宽度|8px) * n|8px|
   *  - - - - - - - - - - - - - - - - - - - - - -
   */

  const { values } = cfg.spreadsheet.dataCfg.fields;
  let result: { maxMainTextInCol: any; maxDerivedTextInCol: any };
  if (isArray(values)) {
    result = colWidthHasRows(cfg, node, facet);
  } else {
    result = colWidthNoRows(cfg, node);
  }
  const { maxMainTextInCol, maxDerivedTextInCol } = result;

  const bolderStyle = cfg.spreadsheet.theme.header.bolderText;
  const style = cfg.spreadsheet.theme.view.text;
  // 当前列主指标最大的文本宽度，缓存一下  4 是用来做像素计算的摇摆值
  const maxMainTextWidth =
    measureTextWidth(maxMainTextInCol, bolderStyle) + 4 || 6;
  // console.log(`${node.label}`, maxMainTextInCol, maxDerivedTextInCol.map(v => v));
  // 主指标+所有该列衍生指标对应的宽度
  const widthArray = [
    maxMainTextWidth,
    ...maxDerivedTextInCol.map((v: any) => measureTextWidth(v, style) + 4),
  ];
  const { showDerivedIcon } = cfg.spreadsheet.options.style.colCfg;
  // 单个衍生指标的宽度 icon+padding/2+self
  const singleDerivedWidth = (selW: number) => {
    if (showDerivedIcon) {
      return STRATEGY_ICON_WIDTH + STRATEGY_PADDING / 2 + selW;
    }
    return selW || 6;
  };
  // 完全按照比例来适配每个文本的宽度，做到无论怎么拖拽不会出现空白
  let infos = [];
  let preInfo = {
    x: STRATEGY_PADDING,
    width: widthArray[0],
    parent: null,
  };
  infos.push(preInfo);
  width = preInfo.x + preInfo.width + STRATEGY_PADDING;
  each(widthArray.slice(1), (value) => {
    const sdw = singleDerivedWidth(value);
    const currentInfo = {
      x: width,
      width: sdw,
      parent: preInfo,
    };
    infos.push(currentInfo);
    width += currentInfo.width + STRATEGY_PADDING;
    preInfo = currentInfo;
  });

  // 列包含了列头文本字段的最大宽度，这里用来计算当此宽度大于实际内容宽度时候，需要对此列
  // 下面的文本做offset处理（最牛逼的实现是考虑每个宽度的占比，用来缩放）
  const currentWidth = node.width;
  if (currentWidth > width) {
    const wholeWidth = reduce(
      infos,
      (rt, info) => {
        return rt + info.width;
      },
      0,
    );
    // 自适应计算后的宽度 - 文本后的宽度 = 各种padding的宽度
    const restWidth = width - wholeWidth;
    // 新宽度下的文本总宽度
    const currentWholeWidth = currentWidth - restWidth;
    // 计算出每个文本宽度在除去了固定的padding后占剩余宽度的比率
    // 然后再在新的宽度中乘以该比率，得到新宽度下的文本宽度
    infos = map(infos, (info) => {
      set(info, 'width', (info.width / wholeWidth) * currentWholeWidth);
      set(
        info,
        'x',
        (info.parent?.x || 0) + (info.parent?.width || 0) + STRATEGY_PADDING,
      );
      return info;
    });
  }
  // 1、缓存当前label 对应的宽度,坐标集合（主指标+衍生指标）
  // 2、缓存当前列的宽度
  const newInfo = {
    widthInfos: {
      [JSON.stringify(node.query)]: infos,
    },
    realWidth: {
      [widthCacheKey]: width,
    },
    lastUserDragWidth: {
      [node.value]: getColWidth(node, colCfg, cellCfg),
    },
  } as ColWidthCache;
  const oldInfos = cfg.spreadsheet.store.get(KEY_COL_REAL_WIDTH_INFO);
  cfg.spreadsheet.store.set(
    KEY_COL_REAL_WIDTH_INFO,
    merge({}, oldInfos, newInfo),
  );

  return width;
};

/**
 * Calculate all col leaf node's width, height and x-coordinate
 * @param colLeafNodes
 * @param rowsHierarchy
 * @param cfg
 * @param facet
 * @param isPivotMode
 */
export default function processColLeafNodeWH(
  colLeafNodes: Node[],
  rowsHierarchy: Hierarchy,
  cfg: SpreadSheetFacetCfg,
  facet: BaseFacet,
  isPivotMode: boolean,
) {
  const { cellCfg, colCfg } = cfg;

  let prevCol = Node.blankNode();

  // // widthByFieldValue is user-dragged width
  // let fieldWidthSum = 0;
  // let fieldWidthNumber = 0;
  // // eslint-disable-next-line no-restricted-syntax
  // for (const current of colLeafNodes) {
  //   const key = `widthByFieldValue.${current.value}`;
  //   if (get(colCfg, key)) {
  //     fieldWidthSum += get(colCfg, key);
  //     fieldWidthNumber += 1;
  //   }
  // }

  let currentColIndex = 0;
  // x & width for leaves
  // eslint-disable-next-line no-restricted-syntax
  for (const current of colLeafNodes) {
    current.colIndex = currentColIndex;
    currentColIndex += 1;
    current.x = prevCol.x + prevCol.width;
    const [isHide] = checkHideMeasureColumn(facet);
    if (isHide) {
      current.hideColNode();
    } else {
      current.height = getColHeight(current, colCfg, cellCfg);
    }
    // The priority: widthByFieldValue(user-dragged) > colWidthType > others
    if (cellCfg.width === WidthType.Compat) {
      // compat
      const dataset = cfg.dataSet;
      if (isPivotMode) {
        // 节点的宽度由文本宽度决定
        const records = dataset.getCellData(getDimsConditionByNode(current));
        const colLabel = dataset.getFieldName(current.label);
        current.width = getColMaxTextWidth(
          current,
          records,
          colLabel,
          true,
          dataset,
        );
      } else {
        const dims = dataset.getDimensionValues(current.key);
        current.width = getColMaxTextWidth(
          current,
          dims,
          current.label,
          false,
          dataset,
        );
      }
      // 如果该cell有拖拽过，用拖拽过的
      // 0e48088b-8bb3-48ac-ae8e-8ab08af46a7b:[DAY]:[RC]:[VALUE] 这样的id get 直接获取不到
      // current.width =  get(colCfg, `widthByFieldValue.${current.value}`, current.width);
      current.width = get(
        get(colCfg, 'widthByFieldValue'),
        `${current.value}`,
        current.width,
      );
    } else {
      // adaptive
      current.width = getColWidth(current, colCfg, cellCfg);
    }
    // 如果数值挂在行头,且均分的宽度大于有衍生指标的宽度,那么用最大宽度
    if (!facet.spreadsheet.isValueInCols()) {
      const width = getColWidthWithDerivedValue(cfg, current, facet);
      current.width = Math.max(current.width, width);
    }
    handleLayoutHook(cfg, null, current);
    prevCol = current;
  }
}
