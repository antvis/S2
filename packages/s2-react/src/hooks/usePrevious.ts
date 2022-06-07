import React from 'react';

export const usePrevious = <T = unknown>(value: T) => {
  const ref = React.useRef<T>(value);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
