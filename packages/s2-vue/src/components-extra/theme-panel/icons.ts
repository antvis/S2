import { h, type FunctionalComponent } from 'vue';

export interface RadioIconProps {
  active?: boolean;
}

export const HierarchyGridTypeIcon: FunctionalComponent<RadioIconProps> = ({
  active,
}) => {
  const fill = active ? '#3471F9' : '#000000';
  const fillOpacity = active ? '1' : '0.45';

  return h(
    'svg',
    {
      class: 'si',
      width: '18px',
      height: '18px',
      viewBox: '0 0 18 18',
      fill: 'currentColor',
    },
    [
      h(
        'g',
        {
          stroke: 'none',
          'stroke-width': '1',
          fill: 'none',
          'fill-rule': 'evenodd',
        },
        [
          h('path', {
            d: 'M7.46428571,2.75 L7.46428571,19.25 L2.75,19.25 L2.75,2.75 L7.46428571,2.75 Z M19.25,15.125 L19.25,19.25 L14.5357143,19.25 L14.5357143,15.125 L19.25,15.125 Z M13.3571429,15.125 L13.3571429,19.25 L8.64285714,19.25 L8.64285714,15.125 L13.3571429,15.125 Z M13.3571429,2.75 L13.3571429,13.75 L8.64285714,13.75 L8.64285714,2.75 L13.3571429,2.75 Z M19.25,9.625 L19.25,13.75 L14.5357143,13.75 L14.5357143,9.625 L19.25,9.625 Z M19.25,2.75 L19.25,8.25 L14.5357143,8.25 L14.5357143,2.75 L19.25,2.75 Z',
            fill,
            'fill-opacity': fillOpacity,
            transform: 'translate(-2, -1)',
          }),
        ],
      ),
    ],
  );
};

export const HierarchyTreeTypeIcon: FunctionalComponent<RadioIconProps> = ({
  active,
}) => {
  const fill = active ? '#3471F9' : '#000000';
  const fillOpacity = active ? '1' : '0.45';

  return h(
    'svg',
    {
      class: 'si',
      width: '18px',
      height: '18px',
      viewBox: '0 0 18 18',
      fill: 'currentColor',
    },
    [
      h(
        'g',
        {
          stroke: 'none',
          'stroke-width': '1',
          fill: 'none',
          'fill-rule': 'evenodd',
        },
        [
          h('path', {
            d: 'M2.75,2.75 L2.75,6.77254902 L6.47225591,6.77254902 L6.47225591,2.75 L2.75,2.75 Z M11.1150697,15.2166667 L11.1150697,19.25 L19.25,19.25 L19.25,15.2166667 L11.1150697,15.2166667 Z M8.12325652,2.75 L8.12325652,6.77254902 L19.2299879,6.77254902 L19.2299879,2.75 L8.12325652,2.75 Z M11.1150697,8.98333333 L11.1150697,13.0166667 L19.2399939,13.0166667 L19.2399939,8.98333333 L11.1150697,8.98333333 Z M3.98074591,6.77254902 L5.23150394,6.77254902 L5.23150394,17.9019608 L3.98074591,17.9019608 L3.98074591,6.77254902 Z M5.23150394,16.5539216 L11.1250758,16.5539216 L11.1250758,17.9019608 L5.23150394,17.9019608 L5.23150394,16.5539216 Z M5.23150394,10.3745098 L11.1250758,10.3745098 L11.1250758,11.7117647 L5.23150394,11.7117647 L5.23150394,10.3745098 Z',
            fill,
            'fill-opacity': fillOpacity,
            transform: 'translate(-2, -1)',
          }),
        ],
      ),
    ],
  );
};

export const ColorfulThemeIcon: FunctionalComponent<RadioIconProps> = ({
  active,
}) => {
  const borderFill = active ? '#3471F9' : '#8C8C8C';
  const stripeFill = active ? '#B0D1FF' : '#BFBFBF';

  return h(
    'svg',
    {
      class: 'si',
      width: '18px',
      height: '16px',
      viewBox: '0 0 18 16',
      fill: 'currentColor',
    },
    [
      h(
        'g',
        {
          stroke: 'none',
          'stroke-width': '1',
          fill: 'none',
          'fill-rule': 'evenodd',
        },
        [
          h('polygon', { fill: stripeFill, points: '1 7 17 7 17 11.5 1 11.5' }),
          h('path', {
            d: 'M6.8,0 L6.8,16 L6,16 L6,0 L6.8,0 Z M11.8,0 L11.8,16 L11,16 L11,0 L11.8,0 Z',
            fill: stripeFill,
          }),
          h('path', {
            d: 'M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z',
            fill: borderFill,
          }),
          h('polygon', {
            fill: borderFill,
            points: '0 0 18 0 18 4.125 0 4.125',
          }),
        ],
      ),
    ],
  );
};

export const NormalThemeIcon: FunctionalComponent<RadioIconProps> = ({
  active,
}) => {
  const borderFill = active ? '#3471F9' : '#8C8C8C';
  const gridFill = active ? '#B0D1FF' : '#BFBFBF';

  return h(
    'svg',
    {
      class: 'si',
      width: '18px',
      height: '16px',
      viewBox: '0 0 18 16',
      fill: 'currentColor',
    },
    [
      h(
        'g',
        {
          stroke: 'none',
          'stroke-width': '1',
          fill: 'none',
          'fill-rule': 'evenodd',
        },
        [
          h('path', {
            d: 'M6.8,0 L6.799,7 L10.999,7 L11,0 L11.8,0 L11.799,7 L17,7 L17,7.8 L11.799,7.8 L11.799,11 L17,11 L17,11.8 L11.799,11.8 L11.8,16 L11,16 L10.999,11.8 L6.799,11.8 L6.8,16 L6,16 L5.999,11.8 L1,11.8 L1,11 L5.999,11 L5.999,7.8 L1,7.8 L1,7 L5.999,7 L6,0 L6.8,0 Z M10.999,7.8 L6.799,7.8 L6.799,11 L10.999,11 L10.999,7.8 Z',
            fill: gridFill,
          }),
          h('path', {
            d: 'M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z',
            fill: borderFill,
          }),
          h('polygon', {
            fill: borderFill,
            points: '0 0 18 0 18 4.125 0 4.125',
          }),
        ],
      ),
    ],
  );
};

export const BasicThemeIcon: FunctionalComponent<RadioIconProps> = ({
  active,
}) => {
  const borderFill = active ? '#3471F9' : '#8C8C8C';
  const gridFill = active ? '#B0D1FF' : '#BFBFBF';

  return h(
    'svg',
    {
      class: 'si',
      width: '18px',
      height: '16px',
      viewBox: '0 0 18 16',
      fill: 'currentColor',
    },
    [
      h(
        'g',
        {
          stroke: 'none',
          'stroke-width': '1',
          fill: 'none',
          'fill-rule': 'evenodd',
        },
        [
          h('path', {
            d: 'M6.8,3.625 L6.799,7 L10.999,7 L11,3.625 L11.8,3.625 L11.799,7 L17,7 L17,7.8 L11.799,7.8 L11.799,11 L17,11 L17,11.8 L11.799,11.8 L11.8,16 L11,16 L10.999,11.8 L6.799,11.8 L6.8,16 L6,16 L5.999,11.8 L1,11.8 L1,11 L5.999,11 L5.999,7.8 L1,7.8 L1,7 L5.999,7 L6,3.625 L6.8,3.625 Z M10.999,7.8 L6.799,7.8 L6.799,11 L10.999,11 L10.999,7.8 Z',
            fill: gridFill,
          }),
          h('path', {
            d: 'M6.8,1 L6.8,3.125 L6,3.125 L6,1 L6.8,1 Z M11.8,1 L11.8,3.125 L11,3.125 L11,1 L11.8,1 Z',
            fill: borderFill,
          }),
          h('path', {
            d: 'M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z',
            fill: borderFill,
          }),
          h('polygon', {
            fill: borderFill,
            points: '0 3.125 18 3.125 18 4.125 0 4.125',
          }),
        ],
      ),
    ],
  );
};

export const ZebraThemeIcon: FunctionalComponent<RadioIconProps> = ({
  active,
}) => {
  const borderFill = active ? '#3471F9' : '#8C8C8C';
  const stripeFill = active ? '#B0D1FF' : '#BFBFBF';

  return h(
    'svg',
    {
      class: 'si',
      width: '18px',
      height: '16px',
      viewBox: '0 0 18 16',
      fill: 'currentColor',
    },
    [
      h(
        'g',
        {
          stroke: 'none',
          'stroke-width': '1',
          fill: 'none',
          'fill-rule': 'evenodd',
        },
        [
          h('polygon', { fill: stripeFill, points: '0 6 18 6 18 8 0 8' }),
          h('polygon', { fill: stripeFill, points: '0 10 18 10 18 12 0 12' }),
          h('polygon', { fill: stripeFill, points: '0 14 18 14 18 16 0 16' }),
          h('path', {
            d: 'M6,0 L6.8,0 L6.8,16 L6,16 Z M11,0 L11.8,0 L11.8,16 L11,16 Z',
            fill: stripeFill,
          }),
          h('polygon', {
            fill: borderFill,
            points: '0 0 18 0 18 4.125 0 4.125',
          }),
        ],
      ),
    ],
  );
};
