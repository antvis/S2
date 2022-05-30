import { isEmpty } from 'lodash';
import React from 'react';
import {
  ListItem,
  TooltipOperatorOptions,
  TooltipSummaryOptions,
  TooltipNameTipsOptions,
  TooltipHeadInfo as TooltipHeadInfoType,
  TooltipInterpretationOptions,
  getTooltipDefaultOptions,
} from '@antv/s2';
import { TooltipDetail } from './components/detail';
import { TooltipHead } from './components/head-info';
import { TooltipInfos } from './components/infos';
import { TooltipInterpretation } from './components/interpretation';
import { TooltipOperator } from './components/operator';
import { TooltipSimpleTips } from './components/simple-tips';
import { TooltipSummary } from './components/summary';
import { TooltipRenderProps } from './interface';

import '@antv/s2/dist/style.min.css';
import '@antv/s2-shared/src/styles/tooltip/index.less';

export const TooltipComponent: React.FC<TooltipRenderProps> = (props) => {
  const { data, options, content, cell } = props;

  const renderOperation = (
    operator: TooltipOperatorOptions,
    onlyMenu?: boolean,
  ) => {
    return (
      operator && (
        <TooltipOperator
          onClick={operator.onClick}
          menus={operator.menus}
          onlyMenu={onlyMenu}
          cell={cell}
        />
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

  const renderDetail = (details: ListItem[]) => {
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

  const renderContent = () => {
    const { operator, onlyMenu } = getTooltipDefaultOptions(options);
    const { summaries, headInfo, details, interpretation, infos, tips, name } =
      data || {};
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
