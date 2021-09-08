import * as React from 'react';
import { TooltipInterpretationOptions } from '@/common/interface';
import { getIcon, HtmlIcon } from '@/common/icons';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';

const Interpretation = (props: TooltipInterpretationOptions) => {
  const { name, icon, text, render } = props;

  const renderIcon = () => {
    if (getIcon(icon)) {
      return (
        <HtmlIcon
          className={`${TOOLTIP_PREFIX_CLS}-interpretation-icon`}
          type={icon}
        />
      );
    }
    const Component = icon;

    return icon && <Component />;
  };

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
        {renderIcon()}
        {renderName()}
      </div>
      {renderText()}
      {renderElement()}
    </div>
  );
};

export default Interpretation;
