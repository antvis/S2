import {
  CloudUploadOutlined,
  CustomerServiceOutlined,
  FileSearchOutlined,
  GithubOutlined,
  PullRequestOutlined,
  YuqueOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import React from 'react';

export const LinkGroup = () => {
  return (
    <FloatButton.Group
      shape="circle"
      style={{ right: 24 }}
      icon={<CustomerServiceOutlined />}
    >
      <FloatButton.BackTop visibilityHeight={100} />
      <FloatButton
        icon={<GithubOutlined />}
        tooltip="前往 GitHub"
        href="https://github.com/antvis/S2"
        target="_blank"
      />
      <FloatButton
        icon={<FileSearchOutlined />}
        tooltip="前往 S2 官网"
        href="https://s2.antv.antgroup.com"
        target="_blank"
      />
      <FloatButton
        icon={<CloudUploadOutlined />}
        tooltip="上传素材 (画眉)"
        href="https://huamei.antgroup-inc.cn/my/space/S_CjpY8T/upload?assetType=all&categoryId=SC_JtvXNMZvcenG0&redirectUrl=%2Fmy%2Fspace%2FS_CjpY8T%3FcategoryId%3DSC_JtvXNMZvcenG0&spaceId=S_CjpY8T&uploadEntityType=asset"
        target="_blank"
      />
      <FloatButton
        icon={<YuqueOutlined />}
        tooltip="前往 S2 语雀"
        href="https://www.yuque.com/antv/vo4vyz"
        target="_blank"
      />
      <FloatButton
        icon={<PullRequestOutlined />}
        tooltip="查看贡献指南"
        href="https://s2.antv.antgroup.com/manual/contribution"
        target="_blank"
      />
    </FloatButton.Group>
  );
};
