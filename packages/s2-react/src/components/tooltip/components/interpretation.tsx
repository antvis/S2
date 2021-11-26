import React from 'react';
import { TooltipInterpretationOptions, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { Icon } from './icon';
import { ReactElement } from '@/common/react-element';

export const Interpretation = (props: TooltipInterpretationOptions) => {
  const { name, icon, text, render } = props;

  const renderName = () => {
    return (
      name && (
        <span className={`${TOOLTIP_PREFIX_CLS}-interpretation-name`}>
          {name}
        </span>
      )
    );
  };

  const renderText = () => {
    return text && <div>{text}</div>;
  };

  const renderElement = () => {
    return <ReactElement content={render} />;
  };

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-interpretation`}>
      <div className={`${TOOLTIP_PREFIX_CLS}-interpretation-head`}>
        <Icon
          icon={icon}
          className={`${TOOLTIP_PREFIX_CLS}-interpretation-icon`}
        />
        {renderName()}
      </div>
      {renderText()}
      {renderElement()}
    </div>
  );
};
