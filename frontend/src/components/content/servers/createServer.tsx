import { Button, Checkbox, Form, Modal, TabPane, Tabs } from '@douyinfe/semi-ui';
import { entity } from '@wailsApp/go/models';
import React, { useEffect, useState } from 'react';
import { CreateServer, GetGroups, TestServerConnect } from '@wailsApp/go/services/Server';
import toast from 'react-hot-toast';

type AddServersProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onGetServers: () => void;
};

export default function CreateServerComponentes({ visible, setVisible, onGetServers }: AddServersProps) {
  const { Option } = Form.Select;
  const initialServerData: entity.Server = new entity.Server();
  const [sshKeyChoose, setSshKeyChoose] = useState(false);
  const [serverData, setServerData] = useState<entity.Server>(initialServerData);
  const [groupsSelect, setGroupsSelect] = useState<entity.Node[]>([]);
  const [testConnectLoading, setConnectLoading] = useState(false);

  const onCreateServer = (data: entity.Server) => {
    CreateServer(data)
      .then(() => {
        setServerData(initialServerData);
        setVisible(false);
        onGetServers();
        toast.success('服务器添加成功');
      })
      .catch(e => {
        toast.error(`服务器添加失败：${e}`);
      });
  };

  const onTestServerConnect = (data: entity.Server) => {
    setConnectLoading(true);
    TestServerConnect(data)
      .then(() => {
        toast.success('测试连接成功');
      })
      .catch(e => {
        toast.error(`测试连接失败：${e}`);
      });
    setConnectLoading(false);
  };

  useEffect(() => {
    if (visible) {
      GetGroups()
        .then(nodes => {
          setGroupsSelect(nodes || []);
        })
        .catch(e => {
          toast.error(e);
        });
    }
  }, [visible]);

  return (
    <Modal
      preventScroll={false}
      width={'600px'}
      title="添加服务器"
      visible={visible}
      closeOnEsc={true}
      centered
      footer={
        <>
          <Button
            theme="solid"
            type="primary"
            className="float-left"
            onClick={() => onTestServerConnect(serverData)}
            loading={testConnectLoading}
          >
            测试连接
          </Button>
          <Button type="primary" onClick={() => setVisible(false)}>
            取消
          </Button>
          <Button type="primary" theme="solid" onClick={() => onCreateServer(serverData)}>
            确认
          </Button>
        </>
      }
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
