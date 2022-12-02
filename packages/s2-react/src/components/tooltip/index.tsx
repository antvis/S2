import { isEmpty } from 'lodash';
import React from 'react';
import { getTooltipDefaultOptions } from '@antv/s2';
import type {
  TooltipDetailListItem,
  TooltipOperatorOptions,
  TooltipSummaryOptions,
  TooltipNameTipsOptions,
  TooltipHeadInfo as TooltipHeadInfoType,
  TooltipInterpretationOptions,
} from '@antv/s2';
import { TooltipDetail } from './components/detail';
import { TooltipHead } from './components/head-info';
import { TooltipInfos } from './components/infos';
import { TooltipInterpretation } from './components/interpretation';
import { TooltipOperator } from './components/operator';
import { TooltipSimpleTips } from './components/simple-tips';
import { TooltipSummary } from './components/summary';
import { TooltipDescription } from './components/description';
import type { TooltipRenderProps } from './interface';

import './index.less';

export const TooltipComponent: React.FC<TooltipRenderProps> = (props) => {
  const { data, options, content, cell } = props;

  const renderOperation = (
    operator: TooltipOperatorOptions<React.ReactNode, React.ReactNode>,
    onlyMenu?: boolean,
  ) => {
    return (
      operator && (
        <TooltipOperator {...operator} onlyMenu={onlyMenu} cell={cell} />
      )
    );
  };

  const renderNameTips = (nameTip: TooltipNameTipsOptions) => {
    const { name, tips } = nameTip || {};
    return <TooltipSimpleTips name={name} tips={tips} />;
  };

  const renderSummary = (summaries: TooltipSummaryOptions[]) => {
    return !isEmpty(summaries) && <TooltipSummary summaries={summaries} />;
  };

  const renderHeadInfo = (headInfo: TooltipHeadInfoType) => {
    const { cols, rows } = headInfo || {};

    return (
      (!isEmpty(cols) || !isEmpty(rows)) && (
        <TooltipHead cols={cols} rows={rows} />
      )
    );
  };

  const renderDetail = (details: TooltipDetailListItem[]) => {
    return !isEmpty(details) && <TooltipDetail list={details} />;
  };

  const renderInfos = (infos: string) => {
    return infos && <TooltipInfos infos={infos} />;
  };

  const renderInterpretation = (
    interpretation: TooltipInterpretationOptions,
  ) => {
    return interpretation && <TooltipInterpretation {...interpretation} />;
  };

  const renderDescription = (description: string) => {
    return <TooltipDescription description={description} />;
  };

  const renderContent = () => {
    const { operator, onlyMenu } = getTooltipDefaultOptions<
      React.ReactNode,
      React.ReactNode
    >(options);

    const {
      summaries,
      headInfo,
      details,
      interpretation,
      infos,
      tips,
      name,
      description,
    } = data || {};
    const nameTip: TooltipNameTipsOptions = { name, tips };

    if (onlyMenu) {
      return renderOperation(operator, true);
    }

    const DefaultContent = (
      <>
        {renderNameTips(nameTip)}
        {renderSummary(summaries)}
        {renderInterpretation(interpretation)}
        {renderHeadInfo(headInfo)}
        {renderDetail(details)}
        {renderInfos(infos)}
        {renderDescription(description)}
      </>
    );

    return (
      <>
        {renderOperation(operator)}
        {content ?? DefaultContent}
      </>
    );
  };

  return renderContent();
};
