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

  const cases = [
    {
      logo: 'https://gw.alipayobjects.com/zos/bmw-prod/2f23b9d9-9d6c-43bf-8c71-796c92a2e7b3.svg',
      isAppLogo: true,
      title: '分群下钻表',
      description: '多维细分网格化的分群探索表格叫分群下钻表。',
      link: `/${i18n.language}/examples/case/proportion#group-drill-down`,
      image: 'https://gw.alipayobjects.com/zos/antfincdn/RYy4GI8Y8d/demo.gif',
    },
    {
      logo: 'https://gw.alipayobjects.com/zos/bmw-prod/291cec1b-9052-4904-a484-56c582815e7b.svg',
      isAppLogo: true,
      title: '指标对比表',
      description:
        '将不同维度下的不同指标进行分组查看和分析的透视表叫指标对比表。',
      link: `/${i18n.language}/examples/case/comparison#measure-comparison`,
      image:
        'https://gw.alipayobjects.com/zos/antfincdn/f3djpYed%249/2d05736c-c119-4168-aa6d-5691f6fc9185.png',
    },
    {
      logo: 'https://gw.alipayobjects.com/zos/bmw-prod/291cec1b-9052-4904-a484-56c582815e7b.svg',
      isAppLogo: true,
      title: '多人群对比表',
      description:
        '不同维度同类对象的对比分析表格叫对比表，而专用于不同属性、偏好等的人群对比分析表格叫人群对比表。',
      link: `/${i18n.language}/examples/case/comparison#multiple-people-comparison`,
      image:
        'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*02QuR7cajBwAAAAAAAAAAAAAARQnAQ',
    },

    {
      logo: 'https://gw.alipayobjects.com/zos/bmw-prod/dca6e7f0-f2e9-4a2b-baea-64fff4933bf4.svg',
      isAppLogo: true,
      title: '单人群占比表',
      description:
        '不同维度同类对象的对比分析表格叫对比表，而专用于不同属性、偏好等的人群对比分析表格叫人群对比表。',
      link: `/${i18n.language}/examples/case/proportion#single-population-proportion`,
      image:
        'https://gw.alipayobjects.com/zos/antfincdn/eNow%2604Qsv/6e579a67-4a4f-4b90-ad91-3fbb1def67fc.png',
    },
    {
      logo: 'https://gw.alipayobjects.com/zos/bmw-prod/02dc8b8b-6bca-4289-a725-4e14c2900763.svg',
      isAppLogo: true,
      title: 'KPI 趋势表',
      description: '用户监控业务KPI进展和趋势的透视表叫KPI趋势表。',
      link: `/${i18n.language}/examples/case/kpi-strategy#basic`,
      image:
        'https://gw.alipayobjects.com/zos/antfincdn/BLitStN%24sR/196f5853-98cf-414f-af83-16b9c594c377.png',
    },
  ];

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
      <Cases className={`${PRE_CLASS}-cases`} cases={cases} />
    </>
  );
};

export default IndexPage;
