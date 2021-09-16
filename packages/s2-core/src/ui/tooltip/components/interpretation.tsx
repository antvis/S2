import * as React from 'react';
import { Icon } from './icon';
import { TooltipInterpretationOptions } from '@/common/interface';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';

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
    const Component = render;

    return Component && <Component />;
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
