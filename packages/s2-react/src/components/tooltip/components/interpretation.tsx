import {
  type TooltipInterpretationOptions,
  TOOLTIP_PREFIX_CLS,
} from '@antv/s2';
import React from 'react';
import { ReactElement } from '../../../common/react-element';
import { TooltipIcon } from './icon';

export const TooltipInterpretation: React.FC<TooltipInterpretationOptions> = (
  props,
) => {
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
        <TooltipIcon
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
