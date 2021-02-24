import * as React from 'react';
import { getIcon, HtmlIcon } from '../../icons';
import { InterpretationProps } from '../interface';
import {
  INTERPRETATION_ICON_CLASS,
  ICON_CLASS,
  INTERPRETATION_CLASS,
  INTERPRETATION_HEAD_CLASS,
  INTERPRETATION_NAME_CLASS,
} from '../constant';

export class Interpretation extends React.PureComponent<
  InterpretationProps,
  {}
> {
  public renderIcon(icon: any): JSX.Element {
    if (getIcon(icon)) {
      return <HtmlIcon className={INTERPRETATION_ICON_CLASS} type={icon} />;
    }
    const Component = icon;

    return icon && <Component className={ICON_CLASS} />;
  }

  public renderName(name: string): JSX.Element {
    return name && <span className={INTERPRETATION_NAME_CLASS}>{name}</span>;
  }

  public renderText(text: string): JSX.Element {
    return text && <div>{text}</div>;
  }

  public renderElement(element: React.ElementType): JSX.Element {
    const Component = element;

    return Component && <Component />;
  }

  public render(): JSX.Element {
    const { name, icon, text, render } = this.props;

    return (
      <div className={INTERPRETATION_CLASS}>
        <div className={INTERPRETATION_HEAD_CLASS}>
          {this.renderIcon(icon)}
          {this.renderName(name)}
        </div>
        {this.renderText(text)}
        {this.renderElement(render)}
      </div>
    );
  }
}
