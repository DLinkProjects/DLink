import React, { useState } from 'react';
import { entity } from '@wailsApp/go/models';
import { CreateGroup } from '@wailsApp/go/services/Server';
import { Input, Modal } from '@douyinfe/semi-ui';
import toast from 'react-hot-toast';

type AddGroupsProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onGetServers: () => void;
};

export default function CreateGroupComponents({ visible, setVisible, onGetServers }: AddGroupsProps) {
  const [groupData, setGroupData] = useState('');

  const onCreateGroup = () => {
    const node = new entity.Node();
    node.name = groupData;
    node.type = 'group';
    node.parent_id = 0;
    CreateGroup(node)
      .then(() => {
        setVisible(false);
        setGroupData('');
        onGetServers();
        toast.success('分组创建成功');
      })
      .catch(e => {
        toast.error(`分组创建失败：${e}`);
      });
  };

  return (
    <Modal
      preventScroll={false}
      width={'600px'}
      title="添加新分组"
      visible={visible}
      onCancel={() => setVisible(false)}
      // closeOnEsc={true}
      centered
      onOk={onCreateGroup}
    >
      <Input placeholder={'分组名称'} value={groupData} onChange={setGroupData}></Input>
    </Modal>
  );
}
