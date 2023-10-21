import { Checkbox, Form, Modal, TabPane, Tabs } from '@douyinfe/semi-ui';
import { entity, types } from '@wailsApp/go/models';
import React, { useEffect, useState } from 'react';
import { createServer, getGroups } from '@/api/server';

type AddServersProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onGetServers: () => void;
};

export default function AddServer({ visible, setVisible, onGetServers }: AddServersProps) {
  const { Option } = Form.Select;
  const initialServerData: types.CreateServerReq = new types.CreateServerReq();
  const [sshKeyChoose, setSshKeyChoose] = useState(false);
  const [serverData, setServerData] = useState<types.CreateServerReq>(initialServerData);
  const [groupsSelect, setGroupsSelect] = useState<entity.Node[]>([]);

  const onCreateServer = (data: types.CreateServerReq) => {
    console.log(data);
    createServer(data).then(() => {
      setServerData(initialServerData);
      setVisible(false);
      onGetServers();
    });
  };

  useEffect(() => {
    if (visible) {
      getGroups().then(res => {
        setGroupsSelect(res.groups || []);
      });
    }
  }, [visible]);

  return (
    <Modal
      preventScroll={false}
      width={'600px'}
      title="添加服务器"
      visible={visible}
      onCancel={() => setVisible(false)}
      closeOnEsc={true}
      onOk={() => onCreateServer(serverData)}
      centered
    >
      <Tabs type="line">
        <TabPane tab="常规配置" itemKey="1">
          <Checkbox
            checked={sshKeyChoose}
            className="pt-2"
            onChange={e => setSshKeyChoose((e.target as HTMLInputElement).checked)}
            aria-label="ssh key"
          >
            使用 SSH 秘钥登录
          </Checkbox>
          <Form onValueChange={values => setServerData(values.serverData)}>
            <Form.Input className="w-full" field="serverData.link_name" label="链接名" placeholder="输入备注或者名称" />
            <Form.Select
              className="w-full"
              field="serverData.node_id"
              label="分组"
              placeholder="请选择分组"
              initValue={0}
            >
              <Option key={0} value={0}>
                不分组
              </Option>
              {groupsSelect.map((item: entity.Node) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Form.Select>
            <div className="flex flex-row justify-between">
              <div className="basis-3/4">
                <Form.Input field="serverData.host" label="服务器地址" placeholder="服务器地址" />
              </div>
              <div>
                <p className="ml-2 mr-2 mt-10">:</p>
              </div>
              <div>
                <Form.InputNumber
                  className="mt-6"
                  field="serverData.port"
                  label="端口"
                  noLabel={true}
                  style={{ width: 176 }}
                  initValue={22}
                />
              </div>
            </div>
            <Form.Input
              field="serverData.username"
              label="用户名"
              style={{ width: '100%' }}
              placeholder="请输入 SSH 用户名"
            />
            {sshKeyChoose ? (
              <Form.Select className="w-full" field="key" label="秘钥" placeholder="请选择 SSH 秘钥">
                <Option value="admin">127.0.0.1</Option>
                <Option value="user">192.168.1.1</Option>
                <Option value="guest">192.168.0.1</Option>
              </Form.Select>
            ) : (
              <Form.Input
                field="serverData.password"
                mode="password"
                label="密码"
                style={{ width: '100%' }}
                placeholder="请输入 SSH 密码"
              />
            )}
          </Form>
        </TabPane>
        <TabPane tab="高级配置" itemKey="2">
          123
        </TabPane>
      </Tabs>
    </Modal>
  );
}
