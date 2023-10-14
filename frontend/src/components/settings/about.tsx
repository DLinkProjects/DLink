import { Typography, Divider, Modal, ToastFactory } from '@douyinfe/semi-ui';
import { BrowserOpenURL } from '@wailsApp/runtime';
import { IconRefresh } from '@douyinfe/semi-icons';
import React from 'react';
import logo from '../../assets/images/logo-1024.png';
import toast, { Toaster } from 'react-hot-toast';

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

  const onCheckUpdate = () => {
    toast.success('当前是最新版本！', {
      style: {
        borderRadius: '8px',
        background: 'var(--semi-color-bg-1)',
        color: 'var(--semi-color-text-0)',
      },
    });
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
          <Divider layout="vertical" margin="12px" />
          <Text onClick={onCheckUpdate} link underline icon={<IconRefresh />}>
            检查更新
          </Text>
        </div>
        <Text className="pt-3" style={{ color: 'var(--semi-color-text-2)' }}>
          Copyright © 2023 DLinkProjects All rights reserved
        </Text>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Modal>
  );
}
