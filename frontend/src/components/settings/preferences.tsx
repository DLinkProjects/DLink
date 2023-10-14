import { Empty, Modal, TreeSelect, Button } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import React from 'react';
import { useTranslation } from 'react-i18next';

type PreferencesProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Preferences({ visible, setVisible }: PreferencesProps) {
  const { i18n } = useTranslation();


  const onClose = () => {
    setVisible(false);
  };

  const onSetLanguage = (value: string) => {
    i18n.changeLanguage(value);
    console.log(value);
  }

  const treeData = [
    {
      label: '中文',
      value: 'zh-CN',
      key: '0',
    },
    {
      label: 'English',
      value: 'en',
      key: '1',
    },
  ];

  const header = (
    <div>
      <h5 className="text-lg">用户偏好设置</h5>
    </div>
  );
  const footer = (
    <div>
      <Button theme="light" type="tertiary" onClick={onClose}>
        取消
      </Button>
      <Button theme="solid" type="primary">
        保存
      </Button>
    </div>
  );

  return (
    <>
      <Modal title="用户偏好设置" visible={visible} header={header} footer={footer}>
        <div className="flex items-center justify-center h-full flex-col">
          <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择"
            onChange={(value) => onSetLanguage(value?.toString() || "")}
          />
          <Empty
            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
            title={'功能建设中'}
            description="当前功能暂未开放，敬请期待。"
          />
        </div>
      </Modal>
    </>
  );
}
