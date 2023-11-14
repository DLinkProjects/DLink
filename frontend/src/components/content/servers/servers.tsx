import {
  Tree,
  ButtonGroup,
  Button,
  Tooltip,
  Empty,
  Typography,
  Table,
  Card,
  Dropdown,
  Descriptions,
  Tag,
  Icon,
} from '@douyinfe/semi-ui';
import {
  IconBolt,
  IconInfoCircle,
  IconAppCenter,
  IconStop,
  IconPause,
  IconKanban,
  IconPulse,
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
  IconSpin,
  IconAlertTriangle,
} from '@douyinfe/semi-icons';
import React, { useEffect, useState } from 'react';
import { OnDragProps, RenderFullLabelProps, TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Resizable } from 're-resizable';
import { useTranslation } from 'react-i18next';
import CreateServerComponents from '@/components/content/servers/createServer';
import { GetServers } from '@wailsApp/go/services/Server';
import CreateGroupComponents from '@/components/content/servers/createGroup';
import toast from 'react-hot-toast';
import { Connect, GetImageList, GetServerSummary } from '@wailsApp/go/services/Docker';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import LinuxSVG from '@/assets/images/icons/linux.svg?react';
import CentOSSVG from '@/assets/images/icons/centos.svg?react';
import DebianSVG from '@/assets/images/icons/debian.svg?react';
import UbuntuSVG from '@/assets/images/icons/ubuntu.svg?react';
import WindowsSVG from '@/assets/images/icons/windows.svg?react';
import DockerSVG from '@/assets/images/icons/docker.svg?react';
import lodash from 'lodash';
import { useStore } from '@/store';
import WarnInfoComponents from './warnInfo';

export default function Servers() {
  const { Column } = Table;
  const { Paragraph, Text } = Typography;
  const { t } = useTranslation();

  const [folderStatus, setFolderStatus] = useState(false);
  const [createServerVisible, setCreateServerVisible] = useState(false);
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [warnInfoVisible, setWarnInfoVisible] = useState(false);
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [rightSelect, setRightSelect] = useState<number>(0);
  const [connectLoading, setConnectLoading] = useState(false);
  const [warnInfo, setWarnInfo] = useState<string[]>([]);
  const { selecteServer, summary, images, setSelectServer, setSummary, setImages } = useStore();

  const serverListStyle = {
    backgroundColor: 'var(--semi-color-bg-0)',
    borderRight: '1px solid var(--semi-color-border)',
  };

  const onOpenCreateServer = () => {
    setCreateServerVisible(true);
  };

  const onOpenCreateGroup = () => {
    setCreateGroupVisible(true);
  };

  const onGetServers = () => {
    GetServers()
      .then(nodes => {
        const findChildren = (parentId: number): TreeNodeData[] => {
          return (nodes || [])
            .filter(item => item.parent_id === parentId)
            .map(item => {
              const children = findChildren(item.id);
              return {
                id: item.id,
                key: item.key.toString(),
                label: item.name,
                children: children.length > 0 ? children : undefined,
                parentId: item.parent_id,
                type: item.type,
              };
            });
        };
        // 从根节点 (parent_id === 0) 开始构建
        const transformedData = findChildren(0);
        setTreeData(transformedData);
      })
      .catch(e => {
        toast.error(`服务器列表获取失败：${e}`);
      });
  };

  const onConnect = (nodeId: number) => {
    setConnectLoading(true);
    Connect(nodeId)
      .then(() => {
        onGetServerSummary();
        onGetImagesList();
      })
      .catch(e => {
        toast.error(`服务器连接失败：${e}`);
      })
      .finally(() => {
        setTimeout(() => setConnectLoading(false), 500);
      });
  };

  useEffect(() => {
    onGetServers();
  });

  const onGetServerSummary = () => {
    GetServerSummary()
      .then(summary => {
        setSummary(summary);
      })
      .catch(e => {
        toast.error(`服务器信息获取失败：${e}`);
      });
  };

  const onGetImagesList = () => {
    GetImageList()
      .then(images => {
        setImages(images);
      })
      .catch(e => {
        toast.error(`镜像列表获取失败：${e}`);
      });
  };

  const Folder: React.FC<any> = ({ showIcon }) => {
    if (showIcon) {
      return <IconFolderOpen />;
    }
    return <IconFolder />;
  };

  const renderLabel = ({ data, className, onCheck, expandIcon }: RenderFullLabelProps) => {
    const { id, label } = data;
    const isFolder = data.type !== 'group';
    return (
      <li
        role="tree"
        className={`${className} flex justify-between h-[30px]`}
        onClick={v => {
          onCheck(v);
        }}
        onContextMenu={v => {
          onCheck(v);
          setRightSelect(id);
        }}
      >
        <Dropdown
          trigger={'contextMenu'}
          position={'bottom'}
          clickToHide={true}
          render={
            <Dropdown.Menu>
              {isFolder && (
                <Dropdown.Item
                  icon={<IconLink />}
                  onClick={() => {
                    onConnect(rightSelect);
                    setSelectServer(label?.toString() || '');
                  }}
                >
                  连接服务
                </Dropdown.Item>
              )}
              <Dropdown.Item icon={<IconEdit />}>编辑名称</Dropdown.Item>
              <Dropdown.Item icon={<IconDelete />} type="danger">
                <span style={{ color: 'var(--semi-color-danger)' }}>删除节点</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <div className="flex items-center w-full">
            {isFolder ? null : expandIcon}
            {isFolder ? (
              <div className="ml-5 mr-1 flex" style={{ color: 'var(--semi-color-text-2)' }}>
                {label === selecteServer ? (
                  connectLoading ? (
                    <IconSpin spin style={{ color: 'var(--semi-color-info)' }} />
                  ) : (
                    <IconServer style={{ color: 'var(--semi-color-info)' }} />
                  )
                ) : (
                  <IconServer />
                )}
              </div>
            ) : (
              <div className="mr-1 flex" style={{ color: 'var(--semi-color-text-2)' }}>
                <Folder showIcon={folderStatus} />
              </div>
            )}
            <Text ellipsis={{ showTooltip: true }} className="w-full">
              {label}
            </Text>
          </div>
        </Dropdown>
      </li>
    );
  };

  const onDrop = (info: OnDragProps) => {
    const { node, dropToGap, dragNode } = info;

    // 如果当前节点的类型不是分组并且拖拽操作是需要把某个节点放入当前节点，那么就提示错误
    if (node.type !== 'group' && !dropToGap) {
      toast.error('当前节点不是分组，不能放入！');
      return;
    }

    // 获取拖拽源节点和目标节点的 key
    const dropKey = node.key;
    const dragKey = dragNode.key;

    const newData = JSON.parse(JSON.stringify(treeData));

    interface FindNodeResult {
      node: TreeNodeData;
      index: number;
      parent: TreeNodeData[];
    }

    const findNode = (key: string, data: TreeNodeData[]): FindNodeResult | undefined => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.key === key) {
          return { node: item, index: i, parent: data };
        } else if (item.children) {
          const result = findNode(key, item.children);
          if (result) {
            return result;
          }
        }
      }
      return undefined;
    };
    // 获取拖拽节点的信息
    const dragResult = findNode(dragKey, newData);
    if (!dragResult) return; // 如果找不到拖拽节点，直接返回

    // 从原位置移除拖拽节点
    dragResult.parent.splice(dragResult.index, 1);

    if (dropToGap) {
      // 如果拖放到了两个节点之间
      const targetResult = findNode(dropKey, newData);
      if (!targetResult) return;

      if (dragNode.type === 'server' && targetResult.node.type === 'group') {
        // 如果被拖拽的节点是 server，并且目标节点是 group，则插入到 group 前面
        targetResult.parent.splice(targetResult.index, 0, dragResult.node);
      } else if (targetResult.node.type === 'group') {
        // 如果目标节点是 group，则将拖拽的节点作为其子节点
        targetResult.node.children = targetResult.node.children || [];
        targetResult.node.children.push(dragResult.node);
      } else {
        // 否则，插入到目标节点前面
        targetResult.parent.splice(targetResult.index, 0, dragResult.node);
      }
    } else {
      // 如果是拖放到了一个节点上，将节点添加到目标节点的子节点数组中
      const targetResult = findNode(dropKey, newData);
      if (!targetResult) return;

      const targetNode = targetResult.node;
      targetNode.children = targetNode.children || [];
      targetNode.children.push(dragResult.node);
    }

    // 更新 state 中的 treeData
    setTreeData(newData);
  };

  const IconForOSType: React.FC<{ value: string }> = ({ value }) => {
    switch (value.toLowerCase()) {
      case 'linux':
        return <LinuxSVG />;
      default:
        return null;
    }
  };

  const IconForOS: React.FC<{ value: string }> = ({ value }) => {
    const v = value.toLowerCase();
    if (v.includes('centos')) return <CentOSSVG />;
    if (v.includes('debian')) return <DebianSVG />;
    if (v.includes('ubuntu')) return <UbuntuSVG />;
    if (v.includes('desktop')) return <WindowsSVG />;
    return null;
  };

  return (
    <div className="flex h-full overflow-hidden">
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
            virtualize={{
              itemSize: 30,
            }}
            draggable
            onDrop={onDrop}
            className="flex-grow h-0"
            expandAll={false}
            treeData={treeData}
            filterTreeNode
            showClear
            showFilteredOnly={true}
            renderFullLabel={renderLabel}
          />
          <div
            className="flex flex-row h-12 flex-shrink-0 items-center justify-between"
            style={{ borderTop: '1px solid var(--semi-color-border)' }}
          >
            <div className="flex ml-2">
              <Tooltip content={t('addNewConnection')}>
                <div
                  onClick={onOpenCreateServer}
                  className="w-11 h-9 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer"
                >
                  <IconCopyAdd style={{ color: 'var(--semi-color-text-2)' }} size="large" />
                </div>
              </Tooltip>
              <Tooltip content={t('addNewGroup')}>
                <div
                  onClick={onOpenCreateGroup}
                  className="w-11 h-9 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer"
                >
                  <IconFolderOpen style={{ color: 'var(--semi-color-text-2)' }} size="large" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </Resizable>
      <div className="flex flex-grow h-full w-full" style={{ overflow: 'hidden' }}>
        {selecteServer ? (
          <div className="flex flex-col overflow-hidden max-h-full w-full">
            <div className="flex-grow-0 flex-shrink-0 mx-4 mt-4">
              <Card bodyStyle={{ padding: 12 }}>
                <div className="flex flex-row gap-4 m-4">
                  <Descriptions className="basis-1/5">
                    <Descriptions.Item itemKey="容器数">
                      <Tag color="cyan" prefixIcon={<IconKanban />}>
                        {summary?.containers}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="运行中">
                      <Tag color="green" prefixIcon={<IconPulse />}>
                        {summary?.containers_running}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="已暂停">
                      <Tag color="yellow" prefixIcon={<IconPause />}>
                        {summary?.containers_paused}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="已停止">
                      <Tag color="red" prefixIcon={<IconStop />}>
                        {summary?.containers_stopped}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions className="basis-1/5">
                    <Descriptions.Item itemKey="警告数">
                      <Tag
                        color="red"
                        prefixIcon={<IconAlertTriangle />}
                        onClick={() => {
                          setWarnInfoVisible(true);
                          setWarnInfo(summary?.warns);
                        }}
                      >
                        {summary?.warns?.length}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="镜像数">
                      <Tag color="cyan" prefixIcon={<IconAppCenter />}>
                        {summary?.images}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="引擎版本">
                      <Tag color="cyan" prefixIcon={<IconInfoCircle />}>
                        {summary?.docker_ver}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="存储驱动">
                      <Tag color="cyan" prefixIcon={<IconBolt />}>
                        {summary?.driver}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions className="basis-1/5">
                    <Descriptions.Item itemKey="主机名">
                      <Tag color="cyan">{summary?.hostname}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="处理器">
                      <Tag color="cyan">{summary?.num_cpu} Core</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="系统内存">
                      <Tag color="cyan">{prettyBytes(summary?.mem_total || 0)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="系统架构">
                      <Tag color="cyan">{summary?.arch}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions className="basis-2/5">
                    <Descriptions.Item itemKey="系统版本">
                      <Tag color="cyan">{summary?.os_ver || 'unknown'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="系统类型">
                      <Tag
                        color="cyan"
                        prefixIcon={<Icon svg={<IconForOSType value={summary?.os_type || 'unknow'} />} />}
                      >
                        {lodash.upperFirst(summary?.os_type)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="操作系统">
                      <Tag color="cyan" prefixIcon={<Icon svg={<IconForOS value={summary?.os || 'unknow'} />} />}>
                        {summary?.os}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="内核版本">
                      <Tag color="cyan">{summary?.kernel_ver}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Card>
            </div>
            <div className="flex-1 position-relative min-h-0 m-4">
              <Card
                style={{
                  height: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                bodyStyle={{ padding: 0, flex: '1', minHeight: '0', position: 'relative' }}
              >
                <Table
                  dataSource={images}
                  pagination={false}
                  sticky={{ top: 0 }}
                  style={{ overflowY: 'scroll', height: '100%' }}
                >
                  <Column
                    title="Repository"
                    dataIndex="name"
                    key="name"
                    render={value => (
                      <Typography.Text ellipsis={{ showTooltip: true }}>
                        <a>{value}</a>
                      </Typography.Text>
                    )}
                  />
                  <Column
                    title="Tag"
                    dataIndex="tag"
                    key="tag"
                    render={value => <Typography.Text ellipsis={{ showTooltip: true }}>{value}</Typography.Text>}
                  />
                  <Column
                    title="Image ID"
                    dataIndex="id"
                    key="id"
                    className="whitespace-nowrap"
                    render={value => (
                      <Paragraph
                        copyable={{
                          content: value,
                          successTip: <IconTick />,
                          icon: <IconCopy style={{ color: 'var(--semi-color-text-2)' }} />,
                        }}
                      >
                        <Text
                          ellipsis={{
                            showTooltip: {
                              opts: { content: value },
                            },
                          }}
                          style={{ width: 80 }}
                        >
                          {value}
                        </Text>
                      </Paragraph>
                    )}
                  />
                  <Column
                    title="Used"
                    dataIndex="used"
                    key="used"
                    render={value => <Tag color={value ? 'green' : 'blue'}>{value ? '已使用' : '未使用'}</Tag>}
                  />
                  <Column
                    title="Size"
                    dataIndex="size"
                    key="size"
                    ellipsis
                    render={value => <span>{prettyBytes(value)}</span>}
                  />
                  <Column
                    title="Created"
                    dataIndex="created"
                    key="created"
                    ellipsis
                    render={value => <span>{moment.unix(value).format('YYYY-MM-DD HH:mm:ss')}</span>}
                  />
                  <Column
                    title="Actions"
                    dataIndex="actions"
                    key="actions"
                    render={() => (
                      <ButtonGroup size="small" theme="borderless">
                        <Button icon={<IconTreeTriangleRight />} />
                        <Button type="danger" icon={<IconDelete />} />
                      </ButtonGroup>
                    )}
                  />
                </Table>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow h-full w-full items-center justify-center">
            <Empty
              image={<DockerSVG style={{ width: 150, height: 150, fill: 'var( --semi-color-tertiary-light-hover)' }} />}
              darkModeImage={<DockerSVG style={{ width: 150, height: 150 }} />}
            />
          </div>
        )}
      </div>
      <CreateServerComponents
        visible={createServerVisible}
        setVisible={setCreateServerVisible}
        onGetServers={onGetServers}
      />
      <CreateGroupComponents
        visible={createGroupVisible}
        setVisible={setCreateGroupVisible}
        onGetServers={onGetServers}
      />
      <WarnInfoComponents visible={warnInfoVisible} setVisible={setWarnInfoVisible} warnInfo={warnInfo} />
    </div>
  );
}
