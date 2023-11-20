import {
  type TooltipInterpretationOptions,
  TOOLTIP_PREFIX_CLS,
} from '@antv/s2';
import React from 'react';
import { ReactElement } from '../../../common/react-element';
import { TooltipIcon } from './icon';

export const TooltipInterpretation: React.FC<TooltipInterpretationOptions> =
  React.memo((props) => {
    const { name, icon, text, content } = props;

    const renderName = () =>
      name && (
        <span className={`${TOOLTIP_PREFIX_CLS}-interpretation-name`}>
          {name}
        </span>
      );

    const renderText = () => text && <div>{text}</div>;

    const renderElement = () => (
      <ReactElement content={content as React.ReactNode} />
    );

    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-interpretation`}>
        <div className={`${TOOLTIP_PREFIX_CLS}-interpretation-head`}>
          <TooltipIcon
            icon={icon as React.ReactNode}
            className={`${TOOLTIP_PREFIX_CLS}-interpretation-icon`}
          />
          {renderName()}
        </div>
        {renderText()}
        {renderElement()}
      </div>
    );
  });

TooltipInterpretation.displayName = 'TooltipInterpretation';
