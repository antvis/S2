// ==================== 通用工具函数 ====================

import type { BaseCell } from '../../../cell/base-cell';
import { RendererType } from '../../../common/constant/renderer';

// 1. 创建蒙版层
const createPreviewOverlay = (
  overlayStyle?: CSSStyleDeclaration,
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
    ...overlayStyle,
  });

  return overlay;
};

// 2. 通用媒体容器样式
const applyMediaContainerStyle = (
  element: HTMLElement,
  mediaContainerStyle?: CSSStyleDeclaration,
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
  mediaContainerStyle?: CSSStyleDeclaration,
): HTMLImageElement => {
  const img = new Image();

  img.src = src;
  applyMediaContainerStyle(img, mediaContainerStyle);
  img.alt = 'preview';

  return img;
};

const createVideoElement = (
  src: string,
  mediaContainerStyle?: CSSStyleDeclaration,
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
    ![RendererType.image, RendererType.video].includes(renderer.type)
  ) {
    return;
  }

  // 创建蒙版和媒体元素
  const overlay = createPreviewOverlay(renderer.clickToPreview?.overlayStyle);
  const mediaElement =
    type === RendererType.image
      ? createImageElement(src, renderer.clickToPreview?.mediaContainerStyle)
      : createVideoElement(src, renderer.clickToPreview?.mediaContainerStyle);

  // 统一事件处理（支持触控）
  const handleClose = (e: Event) => {
    e.preventDefault();
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      mediaElement.remove();
      // 恢复滚动
      document.body.style.overflow = 'auto';
    }
  };

  // 同时监听多种事件类型
  overlay.addEventListener('pointerdown', handleClose);
  overlay.addEventListener('touchstart', handleClose, { passive: false });

  // 禁止背景滚动
  document.body.style.overflow = 'hidden';

  if (type === 'image') {
    (mediaElement as HTMLImageElement).onload = () => {
      overlay.appendChild(mediaElement);
    };
  } else {
    overlay.appendChild(mediaElement);
  }

  document.body.appendChild(overlay);
};
