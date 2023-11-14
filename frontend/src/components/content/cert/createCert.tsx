import { Modal, Form, Tooltip, TabPane, Tabs, Empty, Button, Upload, Space, Tag, withField } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import { useTranslation } from 'react-i18next';
import { IconInfoCircle, IconTickCircle } from '@douyinfe/semi-icons';
import { Certificate } from 'pkijs';
import { fromBER } from 'asn1js';
import { useState } from 'react';

type CreateCertProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateCert({ visible, setVisible }: CreateCertProps) {
  const { t } = useTranslation();
  const [isKey, setIsKey] = useState(false);
  const [isCert, setIsCert] = useState(false);
  const [isCA, setIsCA] = useState(false);

  const KeyTag = () => {
    return (
      <Space>
        <Tag
          color="light-blue"
          size="large"
          shape="circle"
          type="light"
          suffixIcon={
            isCA !== true ? <IconInfoCircle /> : <IconTickCircle style={{ color: 'var(--semi-color-success)' }} />
          }
        >
          {'TLS CA 证书'}
        </Tag>
        <Tag
          color="light-blue"
          size="large"
          shape="circle"
          type="light"
          suffixIcon={
            isCert !== true ? <IconInfoCircle /> : <IconTickCircle style={{ color: 'var(--semi-color-success)' }} />
          }
        >
          {'TLS 证书'}
        </Tag>
        <Tag
          color="light-blue"
          size="large"
          shape="circle"
          type="light"
          suffixIcon={
            isKey !== true ? <IconInfoCircle /> : <IconTickCircle style={{ color: 'var(--semi-color-success)' }} />
          }
        >
          {'TLS Key'}
        </Tag>
      </Space>
    );
  };

  const pemToArrayBuffer = (pem: string): ArrayBuffer => {
    const b64 = pem.replace(/(-----(BEGIN|END) CERTIFICATE-----|\s)/g, '');
    const binaryString = window.atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const isPrivateKey = (pem: string): boolean => {
    const str = pem.split('\n');
    return str[0].includes('BEGIN ENCRYPTED PRIVATE KEY');
  };

  const readFile = (fileInput: any) => {
    console.log(fileInput);
    const cert = fileInput.fileList[0].fileInstance;
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (isPrivateKey(event?.target?.result as string)) {
        setIsKey(true);
        return;
      } else if (event?.target?.result) {
        const arrayBuffer = pemToArrayBuffer(event.target.result as string);
        const asn1 = fromBER(arrayBuffer);
        const certificate = new Certificate({ schema: asn1.result });
        const basicConstraints = certificate.extensions?.find(ext => ext.extnID === '2.5.29.19');
        if (basicConstraints !== undefined && basicConstraints.parsedValue.cA === true) {
          setIsCA(true);
          return;
        } else {
          setIsCert(true);
          return;
        }
      }
    };

    reader.readAsText(cert);
  };

  // withField 封装自定义表单控件
  // link: https://semi.design/zh-CN/input/form#withField%20%E5%B0%81%E8%A3%85%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E5%8D%95%E6%8E%A7%E4%BB%B6
  const FormTag = withField(KeyTag);

  return (
    <Modal
      title="添加 Docker TSL 证书"
      visible={visible}
      width={450}
      centered
      closeOnEsc={true}
      onCancel={() => setVisible(false)}
    >
      <Tabs type="line">
        <TabPane tab="本地导入" itemKey="1">
          <Form>
            <FormTag field="1" label="文件校验" />
            <Form.Upload
              field="file2"
              label="文件导入"
              className="mt-2"
              multiple
              action="https://api.semi.design/upload"
              draggable={true}
              dragMainText={'点击或者拖拽导入文件'}
              dragSubText="支持 pem 格式的文件"
              limit={3}
              uploadTrigger="custom"
              accept=".pem"
              // 我需要获取到准备上传的文件
              // beforeUpload={}
            />
          </Form>
        </TabPane>
        <TabPane tab="客户端生成" itemKey="2">
          <Empty
            className="mt-4"
            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
            title={t('functionsUnderConstruction')}
            description={t('notYetOpen')}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
