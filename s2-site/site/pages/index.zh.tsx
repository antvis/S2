import React from 'react';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import { useTranslation } from 'react-i18next';
import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import Cases from '@antv/gatsby-theme-antv/site/components/Cases';
import './index.less';

const PRE_CLASS = 's2-homepage';
const BannerSVG =
  'https://gw.alipayobjects.com/zos/bmw-prod/1aa91199-b986-4553-a425-6baa18c3a9bd.svg';

const IndexPage = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d55190d1-2787-4a6e-abac-3ee0355f9c46.svg',
      title: t('专业多维交叉分析'),
      description: t('告别单一维度分析，全面拥抱任意维度的自由组合分析'),
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/79453ef5-ea77-423f-ab26-c5fb503e722e.svg',
      title: t('组件灵活，高扩展性'),
      description: t(
        '提供不同层面分析组件，且支持任意自定义扩展（包括但不限于布局、样式、交互、数据流等）',
      ),
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/15da7b71-0026-4b08-a55f-c1e90ca4839c.svg',
      title: t('高性能，秒级渲染'),
      description: t(
        '支持全量百万数据下低于 4s 的渲染，也能通过局部下钻来实现真·秒级渲染。',
      ),
    },
  ];

  const cases = {
    logo: 'https://gw.alipayobjects.com/zos/bmw-prod/83b8e564-ab07-4670-99d7-3cec9feb6e8a.svg',
    isAppLogo: true,
    title: '多维交叉分析表格',
    description:
      'S2 是多维交叉分析领域的表格解决方案，数据驱动视图，提供底层核心库、基础组件库、业务场景库，具备自由扩展的能力，让开发者既能开箱即用，也能基于自身场景自由发挥。',
    link: '#',
    image:
      'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*2PywSZP23xUAAAAAAAAAAAAAARQnAQ',
  };

  const bannerButtons = [
    {
      text: t('图表示例'),
      link: `/${i18n.language}/examples`,
      type: 'primary',
    },
    {
      text: t('现在开始使用'),
      link: `/${i18n.language}/docs/manual/getting-started`,
    },
  ];

  return (
    <>
      <SEO title={t('S2 多维交叉分析表格')} lang={i18n.language} />
      <Banner
        coverImage={
          <img
            width="100%"
            style={{ marginRight: '30px', marginTop: '40px' }}
            src={BannerSVG}
            alt={'banner'}
          />
        }
        title={t('S2 多维交叉分析表格')}
        description={t(
          'S2 是多维交叉分析领域的表格解决方案，数据驱动视图，提供底层核心库、基础组件库、业务场景库，具备自由扩展的能力，让开发者既能开箱即用，也能基于自身场景自由发挥。',
        )}
        className="banner"
        buttons={bannerButtons}
        showGithubStars={true}
      />
      <Features id="features" features={features} style={{ width: '100%' }} />
      <Cases className={`${PRE_CLASS}-cases`} cases={[cases]} />
    </>
  );
};

export default IndexPage;
