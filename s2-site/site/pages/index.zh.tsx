import React from 'react';
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import { useTranslation } from 'react-i18next';
import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import Cases from '@antv/gatsby-theme-antv/site/components/Cases';
import './index.less';

const BannerSVG =
  'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*s0yOSpYP3pAAAAAAAAAAAAAAARQnAQ';
const IndexPage = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/f0ae3be6-9cbb-479d-aba7-522b64d14119.svg',
      title: t('专业多维交叉分析'),
      description: t('告别单一分析维度，全面拥抱任意维度的自由组合分析'),
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8850a540-c1cf-4581-8ff9-9592730fc6b8.svg',
      title: t('组件灵活，高扩展性'),
      description: t(
        '提供不同层面多分析组件，且支持任意自定义扩展（包括但不限于布局、样式、交互、数据 hook 流等）',
      ),
    },
    {
      icon: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*XpGXQJb8qV8AAAAAAAAAAAAAARQnAQ',
      title: t('高性能，秒级渲染'),
      description: t(
        '支持全量百万数据下低于 8s 的渲染，也能通过局部下钻来实现真·秒级渲染。',
      ),
    },
  ];

  const cases = [
    {
      logo: 'https://gw.alipayobjects.com/zos/bmw-prod/5fba9b98-223a-42b5-bf1f-bdfc5f9a78f2.svg',
      isAppLogo: true,
      title: '多维交叉分析表格',
      description:
        '多维交叉分析表格领域的解决方案，完全基于数据驱动的方式，弥补行业中此领域空缺。',
      link: '#',
      image:
        'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*2PywSZP23xUAAAAAAAAAAAAAARQnAQ',
    },
  ];

  const bannerButtons = [
    {
      text: t('图表示例'),
      link: '#features',
      type: 'primary',
    },
    {
      text: t('开始使用'),
      link: `/${i18n.language}/docs/manual/getting-started`,
    },
  ];

  return (
    <>
      <SEO title={t('S2')} lang={i18n.language} />
      <Banner
        coverImage={
          <img
            width="100%"
            style={{ marginLeft: '100px', marginTop: '40px' }}
            src={BannerSVG}
            alt={'banner'}
          />
        }
        title={t('S2 多维交叉分析表格')}
        description={t(
          'S2 是一种多维交叉分析表格领域的解决方案，完全基于数据驱动的方式，弥补行业中此领域空缺。通过提供底层能力库、基础组件、业务场景组件及自由扩展的能力，让开发者基于自身场景自由选择，既能开箱即用，又能自由发挥。',
        )}
        className="banner"
        buttons={bannerButtons}
        showGithubStars={true}
      />
      <Features id="features" features={features} style={{ width: '100%' }} />
      <Cases cases={cases} />
    </>
  );
};

export default IndexPage;
