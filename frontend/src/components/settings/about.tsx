import { Typography, Divider, Modal } from '@douyinfe/semi-ui';
import { BrowserOpenURL } from '@wailsApp/runtime';
import React from 'react';
import logo from '../../assets/images/logo-1024.png';

type AboutProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function About({ visible, setVisible }: AboutProps) {
  const { Text, Title } = Typography;

  const footer = <></>;
  const onOpenBrowser = (url: string) => {
    BrowserOpenURL(url);
  };

  return (
    <Modal title="关于" onCancel={() => setVisible(false)} visible={visible} footer={footer} centered>
      <div className="flex items-center justify-center h-full flex-col">
        <img src={logo} alt="logo" className="w-20 h-20" />
        <Title className="pt-6" heading={4}>
          Docker Link
        </Title>
        <Text className="pt-3">V1.0.0</Text>
        <div className="pt-3">
          <Text
            onClick={() => {
              onOpenBrowser('https://github.com/DLinkProjects/DLink');
            }}
            link
            underline
          >
            源码地址
          </Text>
          <Divider layout="vertical" margin="12px" />
          <Text
            onClick={() => {
              onOpenBrowser('https://github.com/DLinkProjects/DLink');
            }}
            link
            underline
          >
            官方网站
          </Text>
        </div>
        <Text className="pt-3" style={{ color: 'var(--semi-color-text-2)' }}>
          Copyright © 2023 DLinkProjects All rights reserved
        </Text>
      </div>
    </Modal>
  );
}
