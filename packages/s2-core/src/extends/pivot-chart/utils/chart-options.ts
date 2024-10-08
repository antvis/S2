import type { AxisComponent, G2Spec } from '@antv/g2';
import {
  EXTRA_FIELD,
  G2_THEME_TYPE,
  type InternalFullyCellTheme,
  type Node,
  type SpreadSheet,
  type ViewMeta,
} from '@antv/s2';
import { map, unary } from 'lodash';
import { X_FIELD_FORMATTER } from '../constant';
import type { PivotChartSheet } from '../pivot-chart-sheet';

export function getTheme(s2: SpreadSheet): Pick<G2Spec, 'theme'> {
  const themeName = s2.getThemeName();

  return {
    theme: {
      type: G2_THEME_TYPE[themeName] ?? 'light',
    },
  };
}

export function getAxisStyle(cellStyle: InternalFullyCellTheme): AxisComponent {
  return {
    // title
    titleSpacing: 0,
    titleFontSize: cellStyle.bolderText.fontSize,
    titleFontFamily: cellStyle.bolderText.fontFamily,
    titleFontWeight: cellStyle.bolderText.fontWeight,
    titleFill: cellStyle.bolderText.fill,
    titleFillOpacity: cellStyle.bolderText.opacity,

    // label
    labelAlign: 'horizontal',
    labelAutoRotate: false,
    labelFontSize: cellStyle.text.fontSize,
    labelFontFamily: cellStyle.text.fontFamily,
    labelFontWeight: cellStyle.text.fontWeight,
    labelFill: cellStyle.text.fill,
    labelFillOpacity: cellStyle.text.opacity,
    labelStroke: cellStyle.text.fill,
    labelStrokeOpacity: cellStyle.text.fill,

    // tick
    tick: true,
    tickStroke: cellStyle.text.fill,
    tickStrokeOpacity: cellStyle.text.opacity,

    // line
    line: false,
    lineStroke: cellStyle.text.fill,
    lineStrokeOpacity: cellStyle.text.opacity,

    // grid
    grid: false,
  };
}

export function getCoordinate(s2: SpreadSheet): Pick<G2Spec, 'coordinate'> {
  if ((s2 as PivotChartSheet).isPolarCoordinate?.()) {
    return {};
  }

  return {
    coordinate: {
      transform: s2.isValueInCols() ? [{ type: 'transpose' }] : undefined,
    },
  };
}

export function getAxisXOptions(meta: Node, s2: SpreadSheet): AxisComponent {
  const domain = map(meta.children, (child) => {
    const formatter = s2.dataSet.getFieldFormatter(child.field);

    return !child.isTotalRoot && formatter
      ? formatter(child.value, undefined, child)
      : child.value;
  });

  return {
    type: 'axisX',
    scale: {
      x: {
        type: 'band',
        domain,
        range: [0, 1],
      },
    },
  };
}

export function getScaleY(
  value: string,
  s2: SpreadSheet,
): Pick<G2Spec, 'scale'> {
  if ((s2 as PivotChartSheet).isPolarCoordinate?.()) {
    return {};
  }

  const range = s2.dataSet.getValueRangeByField(value);

  return {
    scale: {
      y: {
        type: 'linear',
        domain: [range.minValue, range.maxValue],
        range: [1, 0],
      },
    },
  };
}

export function getAxisYOptions(meta: Node, s2: SpreadSheet): AxisComponent {
  const { field, value } = meta;

  const formatter = s2.dataSet.getFieldFormatter(value);

  return {
    type: 'axisY',
    ...getScaleY(value, s2),
    labelFormatter: unary(formatter),
    title: s2.dataSet.getFieldFormatter(field)?.(value),
  };
}

export function getTooltip(
  viewMeta: ViewMeta,
  s2: SpreadSheet,
): Pick<G2Spec, 'tooltip'> {
  const { xField, yField } = viewMeta;
  const dataSet = s2.dataSet;

  return {
    tooltip: {
      title: (data: any) => {
        return data[X_FIELD_FORMATTER]
          ? dataSet.getFieldFormatter(xField!)?.(data[xField!])
          : data[xField!];
      },
      items: [
        (data: any) => {
          return {
            name: dataSet.getFieldFormatter(EXTRA_FIELD)?.(yField),
            value: dataSet.getFieldFormatter(yField!)?.(data[yField!]),
          };
        },
      ],
    },
  };
}
