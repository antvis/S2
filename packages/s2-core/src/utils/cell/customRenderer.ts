const loadError = new Error('Failed to load image and fallback');

export function asyncDrawImage(options: {
  src: string;
  fallback?: string;
  timeout?: number;
  mediaCache?: Map<string, HTMLElement | null>;
}): Promise<HTMLImageElement> {
  const { src, fallback, timeout = 10000, mediaCache } = options;

  return new Promise((resolve, reject) => {
    if (mediaCache?.has(src)) {
      const cacheImg = mediaCache.get(src);

      if (cacheImg) {
        resolve(mediaCache.get(src) as HTMLImageElement);
      } else {
        reject(loadError);
      }

      return;
    }

    const cacheResolve = (img: HTMLImageElement) => {
      mediaCache?.set(src, img);
      resolve(img);
    };

    const cacheReject = (error: Error) => {
      mediaCache?.set(src, null);
      reject(error);
    };

    const img = new Image();
    const onerror = () => {
      if (fallback) {
        // 如果加载失败，尝试 fallback
        asyncDrawImage({ src: fallback, timeout, mediaCache })
          .then(cacheResolve)
          .catch(cacheReject);
      } else {
        // 如果没有 fallback 或者 fallback 也失败，返回错误
        cacheReject(loadError);
      }
    };

    img.src = src;
    img.crossOrigin = 'Anonymous';

    // 设置超时
    const timeoutId = setTimeout(onerror, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      cacheResolve(img);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      onerror();
    };

    img.onabort = () => {
      clearTimeout(timeoutId);
      onerror();
    };
  });
}

/**
 * 计算图片最佳缩放尺寸
 * @param {number} containerWidth 容器宽度
 * @param {number} containerHeight 容器高度
 * @param {number} naturalWidth 图片原始宽度
 * @param {number} naturalHeight 图片原始高度
 * @returns {{ width: number, height: number }}
 */
export function calculateImageSize(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
): { width: number; height: number } {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return {
      width: 0,
      height: 0,
    };
  }

  if (naturalWidth <= 0 || naturalHeight <= 0) {
    return {
      width: containerWidth,
      height: containerHeight,
    };
  }

  // 计算宽高比例限制
  const widthRatio = containerWidth / naturalWidth;
  const heightRatio = containerHeight / naturalHeight;

  // 取最小值防止溢出
  const scale = Math.min(widthRatio, heightRatio);

  // 返回整数尺寸 (避免亚像素模糊)
  return {
    width: Math.floor(naturalWidth * scale),
    height: Math.floor(naturalHeight * scale),
  };
}
