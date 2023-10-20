import {
  Tree,
  ButtonGroup,
  Button,
  Tooltip,
  Empty,
  Typography,
  Table,
  Card,
  Modal,
  Form,
  Tabs,
  TabPane,
  Checkbox,
  Input,
} from '@douyinfe/semi-ui';
import {
  IconServer,
  IconDelete,
  IconEdit,
  IconCopyAdd,
  IconFolderOpen,
  IconFolder,
  IconTreeTriangleRight,
  IconCopy,
  IconTick,
  IconLink,
} from '@douyinfe/semi-icons';
import React, { useEffect, useState } from 'react';
import { RenderFullLabelProps, TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Resizable } from 're-resizable';
import { useTranslation } from 'react-i18next';
import { entity, types } from '@wailsApp/go/models';
import { createServer, createGroup, getGroups, getServers } from '@/api/server';

type FolderProps = {
  showIcon: boolean;
};

type AddServersProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onGetServers: () => void;
};

type AddGroupsProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onGetServers: () => void;
};

function AddGroups({ visible, setVisible, onGetServers }: AddGroupsProps) {
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

function AddServers({ visible, setVisible, onGetServers }: AddServersProps) {
  const { Option } = Form.Select;
  const initialServerData: types.ServerReq = new types.ServerReq();
  const [sshKeyChoose, setSshKeyChoose] = useState(false);
  const [serverData, setServerData] = useState<types.ServerReq>(initialServerData);
  const [groupsSelect, setGroupsSelect] = useState<entity.Node[]>([]);

  const onCreateServer = (data: types.ServerReq) => {
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

export default function Servers() {
  const { Column } = Table;
  const { Paragraph, Text } = Typography;
  const { t } = useTranslation();
  const [serverValue, setServerValue] = useState('');
  const [folderStatus, setFolderStatus] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [addServerVisible, setAddServerVisible] = useState(false);
  const [addGroupVisible, setAddGroupVisible] = useState(false);
  const [treeData, setTreeData] = useState<TreeNodeData[] | undefined>([]);

  const serverListStyle = {
    backgroundColor: 'var(--semi-color-bg-0)',
    borderRight: '1px solid var(--semi-color-border)',
  };

  const onOpenAddServers = () => {
    setAddServerVisible(true);
  };
  const onOpenAddGroup = () => {
    setAddGroupVisible(true);
  };

  const onGetServers = () => {
    getServers().then(response => {
      const findChildren = (parentId: number): TreeNodeData[] => {
        return (response.nodes || [])
          .filter(item => item.parent_id === parentId)
          .map(item => {
            const children = findChildren(item.id);
            return {
              key: item.id.toString(),
              label: item.name,
              children: children.length > 0 ? children : undefined,
            };
          });
      };
      // 从根节点 (parent_id === 0) 开始构建
      const transformedData = findChildren(0);
      setTreeData(transformedData);
    });
  };

  useEffect(() => {
    onGetServers();
  }, []);

  // MOCK
  const generateTableData = () => {
    const tableData = [];
    for (let i = 1; i <= 20; i++) {
      tableData.push({
        name: `redis${i}`,
        tag: 'latest',
        hash: `7c4b517da47d331a47827390b9e8eb1be7ee68133af9c332660001b4d44782${i < 10 ? '0' + i : i}`,
        status: 'In use',
        created: '2023-10-13 12:02:35',
        size: '152.57 MB',
      });
    }
    return tableData;
  };
  const tableData = generateTableData();

  const Folder: React.FC<FolderProps> = ({ showIcon }) => {
    if (showIcon) {
      return <IconFolderOpen />;
    }
    return <IconFolder />;
  };

  const Action: React.FC<any> = ({ serverValue, setServerValue, isLeaf }) => {
    return (
      <ButtonGroup size="small" theme="borderless">
        {isLeaf && <Button icon={<IconLink />} onClick={() => setServerValue(serverValue)} />}
        <Button icon={<IconEdit />} />
        <Button type="danger" icon={<IconDelete />} />
      </ButtonGroup>
    );
  };

  // TODO 这里的类型定义有问题
  // https://semi.design/zh-CN/show/table
  // 定义每个列表格的类型的时候，需要定义render的类型，但是这里的类型定义有问题
  const TablesHash: React.FC<any> = ({ text }) => {
    return (
      <Paragraph
        copyable={{
          content: text,
          successTip: <IconTick />,
          icon: <IconCopy style={{ color: 'var(--semi-color-text-2)' }} />,
        }}
      >
        <Text
          ellipsis={{
            showTooltip: {
              opts: { content: text },
            },
          }}
          style={{ width: 70 }}
        >
          {text}
        </Text>
      </Paragraph>
    );
  };

  const TablesActions: React.FC = () => {
    return (
      <div>
        <ButtonGroup size="small" theme="borderless">
          <Button icon={<IconTreeTriangleRight />} />
          <Button type="danger" icon={<IconDelete />} />
        </ButtonGroup>
      </div>
    );
  };

  const renderLabel = ({ data, className, onCheck, expandIcon }: RenderFullLabelProps) => {
    const { label } = data;
    const isLeaf = !(data.children && data.children.length);

    return (
      <li
        role="tree"
        className={`${className} flex justify-between h-[30px]`}
        onClick={v => {
          onCheck(v);
          setSelectedLabel(label?.toString() || null);
        }}
      >
        <div className="flex items-center">
          {isLeaf ? null : expandIcon}
          {isLeaf ? (
            <div className="ml-5 mr-1 flex" style={{ color: 'var(--semi-color-text-2)' }}>
              {label === selectedLabel ? <IconServer style={{ color: 'var(--semi-color-info)' }} /> : <IconServer />}
            </div>
          ) : (
            <div className="mr-1 flex" style={{ color: 'var(--semi-color-text-2)' }}>
              <Folder showIcon={folderStatus} />
            </div>
          )}
          <span>{label}</span>
        </div>

        {label === selectedLabel && (
          <div>
            <Action serverValue={label} setServerValue={setServerValue} isLeaf={isLeaf} />
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* <div className="flex-none w-80 h-full" style={serverListStyle}> */}
      <Resizable
        style={serverListStyle}
        defaultSize={{ width: 250, height: '100%' }}
        minWidth={250}
        maxWidth={350}
        enable={{
          right: true,
        }}
      >
        <div className="flex flex-col h-full">
          <Tree
            draggable
            onDrop={v => console.log(v)}
            className="flex-grow h-0"
            expandAll={false}
            treeData={treeData}
            filterTreeNode
            showClear
            showFilteredOnly={true}
            renderFullLabel={renderLabel}
            onExpand={() => setFolderStatus(!folderStatus)}
          />
          <div
            className="flex flex-row h-12 flex-shrink-0 items-center justify-between"
            style={{ borderTop: '1px solid var(--semi-color-border)' }}
          >
            <div className="flex ml-2">
              <Tooltip content={t('addNewConnection')}>
                <div
                  onClick={onOpenAddServers}
                  className="w-11 h-9 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer"
                >
                  <IconCopyAdd style={{ color: 'var(--semi-color-text-2)' }} size="large" />
                </div>
              </Tooltip>
              <Tooltip content={t('addNewGroup')}>
                <div
                  onClick={onOpenAddGroup}
                  className="w-11 h-9 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer"
                >
                  <IconFolderOpen style={{ color: 'var(--semi-color-text-2)' }} size="large" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </Resizable>
      <div className="flex flex-grow h-full w-full">
        {serverValue ? (
          <div className="overflow-auto max-h-full w-full">
            <div className="ml-4 mt-4 mr-4 mb-1">
              <Card title={`Docker Server ${serverValue}`}>docker</Card>
            </div>
            <div className="ml-4 mt-4 mr-4 mb-3 flex-grow">
              <Card title="Docker Images">
                <Table dataSource={tableData} pagination={true}>
                  <Column title="Name" dataIndex="name" key="name" />
                  <Column title="Tag" dataIndex="tag" key="tag" />
                  <Column title="Hash" dataIndex="hash" key="hash" render={text => <TablesHash text={text} />} />
                  <Column title="status" dataIndex="status" key="status" />
                  <Column title="Created" dataIndex="created" key="created" />
                  <Column title="Actions" dataIndex="actions" key="actions" render={() => <TablesActions />} />
                </Table>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow h-full w-full items-center justify-center">
            <Empty
              image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
              darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
              title={t('haveNothing')}
              description={t('noServers')}
            />
          </div>
        )}
      </div>
      <AddServers visible={addServerVisible} setVisible={setAddServerVisible} onGetServers={onGetServers} />
      <AddGroups visible={addGroupVisible} setVisible={setAddGroupVisible} onGetServers={onGetServers} />
    </div>
  );
}
