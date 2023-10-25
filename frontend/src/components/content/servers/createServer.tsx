import { Button, Checkbox, Empty, Form, Modal, TabPane, Tabs } from '@douyinfe/semi-ui';
import { entity } from '@wailsApp/go/models';
import React, { useEffect, useRef, useState } from 'react';
import { CreateServer, GetGroups, TestServerConnect } from '@wailsApp/go/services/Server';
import toast from 'react-hot-toast';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import { useTranslation } from 'react-i18next';
import type { BaseFormApi as FormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';

type AddServersProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onGetServers: () => void;
};

export default function CreateServerComponents({ visible, setVisible, onGetServers }: AddServersProps) {
  const { t } = useTranslation();
  const { Option } = Form.Select;
  const [sshKeyChoose, setSshKeyChoose] = useState(false);
  const [serverData, setServerData] = useState<entity.Server>();
  const [groupsSelect, setGroupsSelect] = useState<entity.Node[]>([]);
  const [testConnectLoading, setConnectLoading] = useState(false);
  const formApiRef = useRef<any>(null);

  const getFormApi = (formApi: FormApi) => {
    formApiRef.current = formApi;
  };

  const onCreateServer = () => {
    if (formApiRef.current) {
      formApiRef.current.validate().then((values: { serverData: entity.Server }) => {
        CreateServer(values.serverData)
          .then(() => {
            setVisible(false);
            onGetServers();
            toast.success('服务器添加成功');
          })
          .catch(e => {
            toast.error(`服务器添加失败：${e}`);
          });
      });
    }
  };

  const onTestServerConnect = () => {
    if (formApiRef.current) {
      formApiRef.current.validate().then((values: { serverData: entity.Server }) => {
        setConnectLoading(true);
        TestServerConnect(values.serverData)
          .then(() => {
            toast.success('测试连接成功');
          })
          .catch(e => {
            toast.error(`测试连接失败：${e}`);
          })
          .finally(() => setConnectLoading(false));
      });
    }
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
      onCancel={() => setVisible(false)}
      // closeOnEsc={true}
      centered
      footer={
        <>
          <Button
            theme="solid"
            type="primary"
            className="float-left"
            onClick={onTestServerConnect}
            loading={testConnectLoading}
          >
            测试连接
          </Button>
          <Button type="primary" onClick={() => setVisible(false)}>
            取消
          </Button>
          <Button type="primary" theme="solid" onClick={onCreateServer}>
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
          <Form getFormApi={getFormApi} onValueChange={values => setServerData(values.serverData)}>
            <Form.Input
              className="w-full"
              rules={[{ required: true, message: '名称不可为空' }]}
              field="serverData.link_name"
              label="链接名"
              placeholder="输入备注或者名称"
            />
            <Form.Select
              className="w-full"
              field="serverData.node_id"
              label={{ text: '分组', optional: true }}
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
                <Form.Input
                  rules={[
                    { required: true, message: 'IP 不可为空' },
                    {
                      validator: (rule, value) => {
                        const ipv4Pattern =
                          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                        return ipv4Pattern.test(value);
                      },
                      message: '请输入正确的 IP 地址',
                    },
                  ]}
                  field="serverData.host"
                  label="服务器地址"
                  placeholder="服务器地址"
                />
              </div>
              <div>
                <p className="ml-2 mr-2 mt-10">:</p>
              </div>
              <div>
                <Form.InputNumber
                  rules={[
                    {
                      required: true,
                      message: '端口不可为空',
                    },
                    {
                      validator: (rule, value) => {
                        const portNumber = parseInt(value, 10); // 将值转换为整数
                        return !isNaN(portNumber) && portNumber >= 0 && portNumber <= 65535;
                      },
                      message: '端口只能在 0-65535',
                    },
                  ]}
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
              rules={[
                {
                  required: true,
                  message: '用户名不可为空',
                },
              ]}
              field="serverData.username"
              label="用户名"
              style={{ width: '100%' }}
              placeholder="请输入 SSH 用户名"
            />
            {sshKeyChoose ? (
              <Form.Select
                rules={[{ required: sshKeyChoose, message: '秘钥不可为空' }]}
                className="w-full"
                field="key"
                label="秘钥"
                placeholder="请选择 SSH 秘钥"
              >
                <Option value="admin">127.0.0.1</Option>
                <Option value="user">192.168.1.1</Option>
                <Option value="guest">192.168.0.1</Option>
              </Form.Select>
            ) : (
              <Form.Input
                rules={[{ required: !sshKeyChoose, message: '密码不可为空' }]}
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
          <Empty
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
