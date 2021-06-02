import React from 'react';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';

import { useTranslation } from 'react-i18next';

const Playground = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEO title={t('工作薄')} lang={i18n.language} />
      <div className="home-container" style={{ marginTop: '-24px' }}>
        test
      </div>
    </>
  );
};

export default Playground;
