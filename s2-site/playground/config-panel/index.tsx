import React, { useMemo } from 'react';
import { each, set } from 'lodash';
import ConfigToken from './config-token';
import { AttributeTree } from './attribute-tree';

type Props = {
  attributes: object;
  // 配置端变化
  onConfigChange: (customConfig: object) => void;
};

export const ConfigPanel: React.FC<Props> = (props) => {
  const { attributes, onConfigChange } = props;
  const attributesConfig = useMemo(() => {
    return ConfigToken;
  }, []);
  return (
    <AttributeTree
      attributes={attributes}
      config={attributesConfig.config}
      relations={attributesConfig.relations}
      onChange={(attrs) => {
        const configValue = {};
        each(attrs, (v, k) => {
          set(configValue, k, v);
        });
        onConfigChange(configValue);
      }}
    />
  );
};
