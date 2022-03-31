export const paletteGray = {
  // --------- basic colors -----------
  basicColors: [
    '#000000',
    '#FcFcFd',
    '#F4F5F7',
    '#F3F4F6',
    '#E7E8EA',
    '#CECFD1',
    '#A9AAAB',
    // brand color
    '#616162',
    '#FFFFFF',
    '#F2F2F2',
    '#E8E6E6',
    '#D1D4DC',
    '#BEC2CB',
    '#282B33',
    '#121826',
  ],
  // ---------- semantic colors ----------
  semanticColors: {
    red: '#FF4D4F',
    green: '#29A294',
  },

  // 用于标记生成色板时固定不变的色值索引
  fixedColorIndex: [0, 8, 13, 14],
  // 主题色索引
  brandColorIndex: 7,
  fontColorBgIndexRelations: {
    0: 3,
    13: 8,
    14: 1,
  },
};
