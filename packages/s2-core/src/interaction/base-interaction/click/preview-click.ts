// ==================== 通用工具函数 ====================

import { FederatedPointerEvent as CanvasEvent } from '@antv/g-lite/types/dom/FederatedPointerEvent';
import type { BaseCell } from '../../../cell/base-cell';
import { S2Event } from '../../../common/constant';
import { CellRendererType } from '../../../common/constant/renderer';
import type { PreviewTheme } from '../../../common/interface';
import { BaseEvent, BaseEventImplement } from '../../../interaction/base-event';

// 1. 创建蒙版层
const createPreviewOverlay = (
  overlayStyle?: Record<string, any>,
): HTMLDivElement => {
  const overlay = document.createElement('div');

  Object.assign(overlay.style, {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(30, 30, 30, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: '9999',
    cursor: 'pointer',
    touchAction: 'none',
    backdropFilter: 'blur(2px)',
    pointerEvents: 'auto',
    ...overlayStyle,
  });

  return overlay;
};

// 2. 通用媒体容器样式
const applyMediaContainerStyle = (
  element: HTMLElement,
  mediaContainerStyle?: Record<string, any>,
) => {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  // 根据横竖屏切换
  const maxSize = isPortrait ? '90vw' : '90vh';
  const minSize = isPortrait ? '60vw' : '60vh';

  Object.assign(element.style, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    minHeight: minSize,
    minWidth: minSize,
    objectFit: 'contain',
    ...mediaContainerStyle,
  });
};

// ==================== 工厂函数 ====================
const createImageElement = (
  src: string,
  mediaContainerStyle?: Record<string, any>,
): HTMLImageElement => {
  const img = new Image();

  img.src = src;
  applyMediaContainerStyle(img, mediaContainerStyle);
  img.alt = 'preview';

  return img;
};

const createVideoElement = (
  src: string,
  mediaContainerStyle?: Record<string, any>,
): HTMLVideoElement => {
  const video = document.createElement('video');

  video.src = src;
  video.controls = true;
  video.preload = 'auto';
  video.playsInline = true;
  // iOS 兼容
  video.setAttribute('webkit-playsinline', 'true');
  video.setAttribute('playsinline', 'true');

  applyMediaContainerStyle(video, mediaContainerStyle);

  return video;
};

// ==================== 主逻辑 ====================
export const bindMediaClick = (cell: BaseCell<any>) => {
  const renderer = cell.getRenderer()!;
  const { type } = renderer;
  const src = cell.getFieldValue()!.toString();

  if (
    renderer!.clickToPreview === false ||
    ![CellRendererType.IMAGE, CellRendererType.VIDEO].includes(renderer.type)
  ) {
    return;
  }

  // 创建蒙版和媒体元素
  const previewTheme = cell.getStyle('preview') as PreviewTheme;
  const overlay = createPreviewOverlay(previewTheme?.overlay);

  const mediaElement =
    type === CellRendererType.IMAGE
      ? createImageElement(src, previewTheme?.mediaContainer)
      : createVideoElement(src, previewTheme?.mediaContainer);

  // 统一事件处理（支持触控）
  const handleClose = (e: Event) => {
    // 关键：阻止所有事件传播和默认行为
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      mediaElement.remove();
      // 恢复滚动
      document.body.style.overflow = 'auto';
    }
  };

  // 同时监听多种事件类型
  ['click', 'touchstart', 'touchend', 'pointerdown'].forEach((eventType) => {
    overlay.addEventListener(eventType, handleClose, { passive: false });
  });

  // 禁止背景滚动
  document.body.style.overflow = 'hidden';

  if (type === CellRendererType.IMAGE) {
    (mediaElement as HTMLImageElement).onload = () => {
      overlay.appendChild(mediaElement);
    };
  } else {
    overlay.appendChild(mediaElement);
  }

  document.body.appendChild(overlay);
};

export class PreviewClick extends BaseEvent implements BaseEventImplement {
  bindEvents(): void {
    const events = [
      S2Event.DATA_CELL_CLICK,
      S2Event.ROW_CELL_CLICK,
      S2Event.COL_CELL_CLICK,
    ];

    events.forEach((eventType) => {
      this.spreadsheet.on(eventType, (event: CanvasEvent) =>
        this.bindMediaCellClick(event),
      );
    });
  }

  bindMediaCellClick(event: CanvasEvent) {
    const cell = this.spreadsheet.getCell<BaseCell<any>>(event.target);

    if (cell?.getRenderer?.()?.type) {
      bindMediaClick(cell);
    }
  }
}
