import React from 'react';
import type { RadioIconProps } from '../../common/interface/icon';

export const HierarchyGridTypeIcon = React.memo<RadioIconProps>(
  ({ active }) => {
    return (
      <svg
        className="si"
        width="18px"
        height="18px"
        viewBox="0 0 18 18"
        fill="currentColor"
      >
        <g
          id="设计输出"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            transform="translate(-270.000000, -4993.000000)"
            fill="#000000"
            id="编组-31"
          >
            <g transform="translate(127.000000, 4744.000000)">
              <g id="编组-10" transform="translate(28.000000, 246.000000)">
                <g
                  id="icon/图表/平铺交叉表"
                  transform="translate(113.000000, 1.000000)"
                >
                  <rect
                    id="矩形"
                    fillOpacity="0"
                    x="0"
                    y="0"
                    width="22"
                    height="22"
                    rx="1"
                  />
                  <path
                    d="M7.46428571,2.75 L7.46428571,19.25 L2.75,19.25 L2.75,2.75 L7.46428571,2.75 Z M19.25,15.125 L19.25,19.25 L14.5357143,19.25 L14.5357143,15.125 L19.25,15.125 Z M13.3571429,15.125 L13.3571429,19.25 L8.64285714,19.25 L8.64285714,15.125 L13.3571429,15.125 Z M13.3571429,2.75 L13.3571429,13.75 L8.64285714,13.75 L8.64285714,2.75 L13.3571429,2.75 Z M19.25,9.625 L19.25,13.75 L14.5357143,13.75 L14.5357143,9.625 L19.25,9.625 Z M19.25,2.75 L19.25,8.25 L14.5357143,8.25 L14.5357143,2.75 L19.25,2.75 Z"
                    id="形状结合"
                    {...(active
                      ? {
                          fill: '#3471F9',
                        }
                      : { fillOpacity: 0.45 })}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  },
);

export const HierarchyTreeTypeIcon = React.memo<RadioIconProps>(
  ({ active }) => {
    return (
      <svg
        className="si"
        width="18px"
        height="18px"
        viewBox="0 0 18 18"
        fill="currentColor"
      >
        <g
          id="设计输出"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            transform="translate(-316.000000, -4993.000000)"
            fill="#000000"
            id="编组-31"
          >
            <g transform="translate(127.000000, 4744.000000)">
              <g id="编组-10" transform="translate(28.000000, 246.000000)">
                <g
                  id="icon/pivot-table"
                  transform="translate(159.000000, 1.000000)"
                >
                  <rect
                    id="矩形"
                    fillOpacity="0"
                    x="0"
                    y="0"
                    width="22"
                    height="22"
                  />
                  <path
                    d="M2.75,2.75 L2.75,6.77254902 L6.47225591,6.77254902 L6.47225591,2.75 L2.75,2.75 Z M11.1150697,15.2166667 L11.1150697,19.25 L19.25,19.25 L19.25,15.2166667 L11.1150697,15.2166667 Z M8.12325652,2.75 L8.12325652,6.77254902 L19.2299879,6.77254902 L19.2299879,2.75 L8.12325652,2.75 Z M11.1150697,8.98333333 L11.1150697,13.0166667 L19.2399939,13.0166667 L19.2399939,8.98333333 L11.1150697,8.98333333 Z M3.98074591,6.77254902 L5.23150394,6.77254902 L5.23150394,17.9019608 L3.98074591,17.9019608 L3.98074591,6.77254902 Z M5.23150394,16.5539216 L11.1250758,16.5539216 L11.1250758,17.9019608 L5.23150394,17.9019608 L5.23150394,16.5539216 Z M5.23150394,10.3745098 L11.1250758,10.3745098 L11.1250758,11.7117647 L5.23150394,11.7117647 L5.23150394,10.3745098 Z"
                    id="形状"
                    {...(active
                      ? {
                          fill: '#3471F9',
                        }
                      : { fillOpacity: 0.45 })}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  },
);

export const ColorfulThemeIcon = React.memo<RadioIconProps>(({ active }) => {
  if (active) {
    return (
      <svg
        className="si"
        width="18px"
        height="16px"
        viewBox="0 0 18 16"
        fill="currentColor"
      >
        <g
          id="设计输出"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g transform="translate(-699.000000, -5041.000000)" id="编组-31">
            <g transform="translate(127.000000, 4744.000000)">
              <g id="编组-19备份" transform="translate(569.000000, 293.000000)">
                <g id="编组" transform="translate(3.000000, 4.000000)">
                  <polygon
                    id="矩形备份-21"
                    fill="#B0D1FF"
                    points="1 7 17 7 17 11.5 1 11.5"
                  />
                  <path
                    d="M6.8,0 L6.8,16 L6,16 L6,0 L6.8,0 Z M11.8,0 L11.8,16 L11,16 L11,0 L11.8,0 Z"
                    id="形状结合备份"
                    fill="#B0D1FF"
                  />
                  <path
                    d="M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z"
                    id="矩形备份-18"
                    fill="#3471F9"
                  />
                  <polygon
                    id="矩形备份-20"
                    fill="#3471F9"
                    points="0 2.66453526e-14 18 2.66453526e-14 18 4.125 0 4.125"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="si"
      width="18px"
      height="16px"
      viewBox="0 0 18 16"
      fill="currentColor"
    >
      <g
        id="设计输出"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g transform="translate(-699.000000, -5072.000000)" id="编组-31">
          <g transform="translate(127.000000, 4744.000000)">
            <g id="编组" transform="translate(572.000000, 328.000000)">
              <polygon
                id="矩形备份-21"
                fill="#BFBFBF"
                points="1 7 17 7 17 11.5 1 11.5"
              />
              <path
                d="M6.8,0 L6.8,16 L6,16 L6,0 L6.8,0 Z M11.8,0 L11.8,16 L11,16 L11,0 L11.8,0 Z"
                id="形状结合备份"
                fill="#BFBFBF"
              />
              <path
                d="M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z"
                id="矩形备份-18"
                fill="#8C8C8C"
              />
              <polygon
                id="矩形备份-20"
                fill="#8C8C8C"
                points="0 2.66453526e-14 18 2.66453526e-14 18 4.125 0 4.125"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
});

export const NormalThemeIcon = React.memo<RadioIconProps>(({ active }) => {
  if (active) {
    return (
      <svg
        className="si"
        width="18px"
        height="16px"
        viewBox="0 0 18 16"
        fill="currentColor"
      >
        <g
          id="设计输出"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g transform="translate(-780.000000, -5041.000000)" id="编组-31">
            <g transform="translate(127.000000, 4744.000000)">
              <g id="编组-27" transform="translate(653.000000, 297.000000)">
                <path
                  d="M6.8,0 L6.799,7 L10.999,7 L11,0 L11.8,0 L11.799,7 L17,7 L17,7.8 L11.799,7.8 L11.799,11 L17,11 L17,11.8 L11.799,11.8 L11.8,16 L11,16 L10.999,11.8 L6.799,11.8 L6.8,16 L6,16 L5.999,11.8 L1,11.8 L1,11 L5.999,11 L5.999,7.8 L1,7.8 L1,7 L5.999,7 L6,0 L6.8,0 Z M10.999,7.8 L6.799,7.8 L6.799,11 L10.999,11 L10.999,7.8 Z"
                  id="形状结合"
                  fill="#B0D1FF"
                />
                <path
                  d="M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z"
                  id="矩形"
                  fill="#3471F9"
                />
                <polygon
                  id="矩形"
                  fill="#3471F9"
                  points="0 2.66453526e-14 18 2.66453526e-14 18 4.125 0 4.125"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="si"
      width="18px"
      height="16px"
      viewBox="0 0 18 16"
      fill="currentColor"
    >
      <g
        id="设计输出"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g transform="translate(-780.000000, -5072.000000)" id="编组-31">
          <g transform="translate(127.000000, 4744.000000)">
            <g id="编组-27" transform="translate(653.000000, 328.000000)">
              <path
                d="M6.8,0 L6.799,7 L10.999,7 L11,0 L11.8,0 L11.799,7 L17,7 L17,7.8 L11.799,7.8 L11.799,11 L17,11 L17,11.8 L11.799,11.8 L11.8,16 L11,16 L10.999,11.8 L6.799,11.8 L6.8,16 L6,16 L5.999,11.8 L1,11.8 L1,11 L5.999,11 L5.999,7.8 L1,7.8 L1,7 L5.999,7 L6,0 L6.8,0 Z M10.999,7.8 L6.799,7.8 L6.799,11 L10.999,11 L10.999,7.8 Z"
                id="形状结合"
                fill="#BFBFBF"
              />
              <path
                d="M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z"
                id="矩形"
                fill="#8C8C8C"
              />
              <polygon
                id="矩形"
                fill="#8C8C8C"
                points="0 0 18 0 18 4.125 0 4.125"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
});

export const BasicThemeIcon = React.memo<RadioIconProps>(({ active }) => {
  if (active) {
    return (
      <svg
        className="si"
        width="18px"
        height="16px"
        viewBox="0 0 18 16"
        fill="currentColor"
      >
        <g
          id="设计输出"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g transform="translate(-867.000000, -5041.000000)" id="编组-31">
            <g transform="translate(127.000000, 4744.000000)">
              <g id="编组" transform="translate(740.000000, 297.000000)">
                <path
                  d="M6.8,3.625 L6.799,7 L10.999,7 L11,3.625 L11.8,3.625 L11.799,7 L17,7 L17,7.8 L11.799,7.8 L11.799,11 L17,11 L17,11.8 L11.799,11.8 L11.8,16 L11,16 L10.999,11.8 L6.799,11.8 L6.8,16 L6,16 L5.999,11.8 L1,11.8 L1,11 L5.999,11 L5.999,7.8 L1,7.8 L1,7 L5.999,7 L6,3.625 L6.8,3.625 Z M10.999,7.8 L6.799,7.8 L6.799,11 L10.999,11 L10.999,7.8 Z"
                  id="形状结合备份-2"
                  fill="#B0D1FF"
                />
                <path
                  d="M6.8,1 L6.8,3.125 L6,3.125 L6,1 L6.8,1 Z M11.8,1 L11.8,3.125 L11,3.125 L11,1 L11.8,1 Z"
                  id="形状结合"
                  fill="#3471F9"
                />
                <path
                  d="M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z"
                  id="矩形备份-22"
                  fill="#3471F9"
                />
                <polygon
                  id="矩形备份-23"
                  fill="#3471F9"
                  points="0 3.125 18 3.125 18 4.125 0 4.125"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="si"
      width="18px"
      height="16px"
      viewBox="0 0 18 16"
      fill="currentColor"
    >
      <g
        id="设计输出"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g transform="translate(-867.000000, -5072.000000)" id="编组-31">
          <g transform="translate(127.000000, 4744.000000)">
            <g id="编组" transform="translate(740.000000, 328.000000)">
              <path
                d="M6.8,3.625 L6.799,7 L10.999,7 L11,3.625 L11.8,3.625 L11.799,7 L17,7 L17,7.8 L11.799,7.8 L11.799,11 L17,11 L17,11.8 L11.799,11.8 L11.8,16 L11,16 L10.999,11.8 L6.799,11.8 L6.8,16 L6,16 L5.999,11.8 L1,11.8 L1,11 L5.999,11 L5.999,7.8 L1,7.8 L1,7 L5.999,7 L6,3.625 L6.8,3.625 Z M10.999,7.8 L6.799,7.8 L6.799,11 L10.999,11 L10.999,7.8 Z"
                id="形状结合备份-2"
                fill="#BFBFBF"
              />
              <path
                d="M6.8,1 L6.8,3.125 L6,3.125 L6,1 L6.8,1 Z M11.8,1 L11.8,3.125 L11,3.125 L11,1 L11.8,1 Z"
                id="形状结合"
                fill="#8C8C8C"
              />
              <path
                d="M18,0 L18,16 L0,16 L0,0 L18,0 Z M17,1 L1,1 L1,15 L17,15 L17,1 Z"
                id="矩形备份-22"
                fill="#8C8C8C"
              />
              <polygon
                id="矩形备份-23"
                fill="#8C8C8C"
                points="0 3.125 18 3.125 18 4.125 0 4.125"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
});

export const ZebraThemeIcon = React.memo<RadioIconProps>(({ active }) => {
  if (active) {
    return (
      <svg
        className="si"
        width="18px"
        height="16px"
        viewBox="0 0 18 16"
        version="1.1"
        fill="currentColor"
      >
        <title>斑马纹选中</title>
        <g
          id="设计稿"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="交叉表斑马纹样式"
            transform="translate(-1845.000000, -728.000000)"
          >
            <g
              id="编组-28备份-2"
              transform="translate(1567.000000, 443.000000)"
            >
              <g id="编组-26" transform="translate(28.000000, 281.000000)">
                <g id="斑马纹选中" transform="translate(247.000000, 0.000000)">
                  <g
                    id="icon/交叉表/斑马纹-选中"
                    transform="translate(3.000000, 4.000000)"
                  >
                    <polygon
                      id="矩形备份-21"
                      fill="#B0D1FF"
                      points="0 6 18 6 18 8 0 8"
                    ></polygon>
                    <polygon
                      id="矩形备份-22"
                      fill="#B0D1FF"
                      points="0 10 18 10 18 12 0 12"
                    ></polygon>
                    <polygon
                      id="矩形备份-23"
                      fill="#B0D1FF"
                      points="0 14 18 14 18 16 0 16"
                    ></polygon>
                    <path
                      d="M6,0 L6.8,0 L6.8,16 L6,16 Z M11,0 L11.8,0 L11.8,16 L11,16 Z"
                      id="形状结合备份"
                      fill="#B0D1FF"
                    ></path>
                    <path
                      d="M18,0 L0,0 L18,0 Z M17,1 L1,1 L17,1 Z"
                      id="矩形备份-18"
                      fill="#3471F9"
                    ></path>
                    <polygon
                      id="矩形备份-20"
                      fill="#3471F9"
                      points="0 2.66453526e-14 18 2.66453526e-14 18 4.125 0 4.125"
                    ></polygon>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="si"
      width="18px"
      height="16px"
      viewBox="0 0 18 16"
      version="1.1"
    >
      <title>斑马纹未选中</title>
      <g
        id="设计稿"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="交叉表斑马纹样式"
          transform="translate(-2112.000000, -549.000000)"
        >
          <g id="斑马纹未选中" transform="translate(2109.000000, 545.000000)">
            <g id="斑马纹风/未选中" transform="translate(3.000000, 4.000000)">
              <polygon
                id="矩形备份-21"
                fill="#BFBFBF"
                points="0 6 18 6 18 8 0 8"
              ></polygon>
              <polygon
                id="矩形备份-22"
                fill="#BFBFBF"
                points="0 10 18 10 18 12 0 12"
              ></polygon>
              <polygon
                id="矩形备份-23"
                fill="#BFBFBF"
                points="0 14 18 14 18 16 0 16"
              ></polygon>
              <path
                d="M6,0 L6.8,0 L6.8,16 L6,16 Z M11,0 L11.8,0 L11.8,16 L11,16 Z"
                id="形状结合备份"
                fill="#BFBFBF"
              ></path>
              <path
                d="M18,0 L0,0 L18,0 Z M17,1 L1,1 L17,1 Z"
                id="矩形备份-18"
                fill="#8C8C8C"
              ></path>
              <polygon
                id="矩形备份-20"
                fill="#8C8C8C"
                points="0 2.66453526e-14 18 2.66453526e-14 18 4.125 0 4.125"
              ></polygon>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
});
