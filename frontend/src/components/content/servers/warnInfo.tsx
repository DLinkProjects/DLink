import { IconCopy } from '@douyinfe/semi-icons';
import { Button, Collapse, Modal } from '@douyinfe/semi-ui';

type WarnInfoProps = {
  warnInfo: string[];
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WarnInfoComponents({ visible, setVisible, warnInfo }: WarnInfoProps) {
  return (
    <Modal
      preventScroll={false}
      width={'600px'}
      title="警告信息"
      visible={visible}
      footer={
        <Button type="primary" theme="solid" onClick={() => setVisible(false)}>
          关闭
        </Button>
      }
      centered
    >
      <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <Collapse>
          {warnInfo.map((item, index) => (
            <Collapse.Panel header={item?.substring(0, 50) + '...'} itemKey={index.toString()} extra={<IconCopy />}>
              <p>{item}</p>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </Modal>
  );
}
