import * as React from 'react';
import { TooltipInterpretationOptions, TOOLTIP_PREFIX_CLS } from '@antv/s2';
import { Icon } from './icon';

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
