import { omit } from 'lodash';

import type { IApi } from 'dumi';

export default (api: IApi) => {
  api.modifyConfig((memo) => {
    return {
      ...memo,
      alias: omit(memo.alias, ['antd', 'react', 'react-dom']),
    };
  });
};
