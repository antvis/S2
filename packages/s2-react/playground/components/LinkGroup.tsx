import {
  CloudUploadOutlined,
  FileSearchOutlined,
  GithubOutlined,
  PullRequestOutlined,
  YuqueOutlined,
  FullscreenOutlined,
  BgColorsOutlined,
  MoreOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import React from 'react';
import { usePlaygroundContext } from '../context/playground.context';

export const LinkGroup = () => {
  const { themeCfg, setThemeCfg } = usePlaygroundContext();
  const [fullScreen, setFullScreen] = React.useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullScreen(false);
    }
  };

  return (
    <FloatButton.Group
      trigger="hover"
      shape="circle"
      style={{ right: 24 }}
      icon={<MoreOutlined />}
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
      <FloatButton
        icon={fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        tooltip={fullScreen ? '退出全屏' : '全屏'}
        onClick={() => {
          toggleFullScreen();
        }}
      />
      <FloatButton
        icon={<BgColorsOutlined />}
        tooltip={`切换主题 (${themeCfg?.name})`}
        onClick={() => {
          setThemeCfg?.({
            name: themeCfg?.name !== 'dark' ? 'dark' : 'default',
          });
        }}
      />
    </FloatButton.Group>
  );
};
