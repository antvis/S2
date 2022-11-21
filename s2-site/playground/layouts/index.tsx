import React from 'react';
import { Layout } from 'antd';
import { ConfigPanel } from '../../playground/config-panel';
import { CustomSheet } from '../sheet-component';
import { sheetDataCfg } from '../sheet-component/config';
import './index.less';

const Page: React.FC = () => {
  const [customConfig, setCustomConfig] = React.useState({
    ...sheetDataCfg.fields,
    ...{ adaptive: true },
  });

  const onConfigChange = (value) => {
    setCustomConfig({ ...customConfig, ...value });
  };

  return (
    <div className="playground-layout">
      <Layout>
        <Layout.Sider width={280}>
          <ConfigPanel
            attributes={customConfig}
            onConfigChange={onConfigChange}
          />
        </Layout.Sider>
        <CustomSheet sheetConfig={customConfig} />
      </Layout>
    </div>
  );
};

export default Page;
