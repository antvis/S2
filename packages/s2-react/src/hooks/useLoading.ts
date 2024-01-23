import React from 'react';
import { SpreadSheet, S2Event } from '@antv/s2';

export const useLoading = (s2: SpreadSheet, loadingFromProps?: boolean) => {
  const [loading, setLoading] = React.useState<boolean>(
    loadingFromProps ?? false,
  );

  React.useEffect(() => {
    s2?.on(S2Event.LAYOUT_BEFORE_RENDER, () => {
      setLoading(true);
    });

    s2?.on(S2Event.LAYOUT_AFTER_RENDER, () => {
      setLoading(false);
    });
  }, [s2]);

  return {
    loading: loadingFromProps ?? loading,
    setLoading,
  };
};
