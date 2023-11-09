import { Modal, TreeSelect, Button } from '@douyinfe/semi-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

type PreferencesProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Preferences({ visible, setVisible }: PreferencesProps) {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const preference = t('preference');
  const cancel = t('cancel');
  const save = t('save');

  const onClose = () => {
    setVisible(false);
  };

  const onSetLanguage = (value: string) => {
    if (value === 'systemLang') {
      const systemLang = window.navigator.languages[0];
      i18n.changeLanguage(systemLang);
    } else {
      i18n.changeLanguage(value);
    }
  };

  const treeData = [
    {
      label: t('followSystem'),
      value: 'systemLang',
      key: '0',
    },
    {
      label: '中文',
      value: 'zh-CN',
      key: '1',
    },
    {
      label: 'English',
      value: 'en',
      key: '2',
    },
  ];

  const header = (
    <div>
      <h5 className="text-lg">{preference}</h5>
    </div>
  );
  const footer = (
    <div>
      <Button theme="light" type="tertiary" onClick={onClose}>
        {cancel}
      </Button>
      <Button theme="solid" type="primary">
        {save}
      </Button>
    </div>
  );

  return (
    <>
      <Modal preventScroll={false} title={t('preference')} visible={visible} header={header} footer={footer}>
        <div className="flex items-center justify-center h-full flex-col">
          <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder={t('followSystem')}
            onChange={value => onSetLanguage(value?.toString() || '')}
          />
        </div>
      </Modal>
    </>
  );
}
