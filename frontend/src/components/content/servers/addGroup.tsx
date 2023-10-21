import React, { useState } from 'react';
import { types } from '@wailsApp/go/models';
import { createGroup } from '@/api/server';
import { Input, Modal } from '@douyinfe/semi-ui';

type AddGroupsProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onGetServers: () => void;
};

export default function AddGroup({ visible, setVisible, onGetServers }: AddGroupsProps) {
  const [groupData, setGroupData] = useState('');

  const onCreateGroup = () => {
    const req = new types.GroupReq();
    req.name = groupData;
    req.type = 'group';
    req.parent_id = 0;
    createGroup(req).then(() => {
      setVisible(false);
      setGroupData('');
      onGetServers();
    });
  };

  return (
    <Modal
      preventScroll={false}
      width={'600px'}
      title="添加新分组"
      visible={visible}
      onCancel={() => setVisible(false)}
      closeOnEsc={true}
      centered
      onOk={onCreateGroup}
    >
      <Input placeholder={'分组名称'} value={groupData} onChange={setGroupData}></Input>
    </Modal>
  );
}
