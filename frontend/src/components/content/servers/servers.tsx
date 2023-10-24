import { Tree, ButtonGroup, Button, Tooltip, Empty, Typography, Table, Card, Dropdown } from '@douyinfe/semi-ui';
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
import { OnDragProps, RenderFullLabelProps, TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Resizable } from 're-resizable';
import { useTranslation } from 'react-i18next';
import CreateServerComponents from '@/components/content/servers/createServer';
import { GetServers } from '@wailsApp/go/services/Server';
import CreateGroupComponents from '@/components/content/servers/createGroup';
import toast from 'react-hot-toast';
import { Connect, GetImageList } from '@wailsApp/go/services/Docker';
import { entity } from '@wailsApp/go/models';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';

export default function Servers() {
  const { Column } = Table;
  const { Paragraph, Text } = Typography;
  const { t } = useTranslation();
  const [serverLabel, setServerLabel] = useState<string>();
  const [connected, setConnected] = useState<boolean>(false);
  const [imagesTableData, setImagesTableData] = useState<entity.Image[]>();
  const [folderStatus, setFolderStatus] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [createServerVisible, setCreateServerVisible] = useState(false);
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [treeData, setTreeData] = useState<TreeNodeData[] | undefined>();
  const [rightSelect, setRightSelect] = useState<number | null>(null);

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

  const onConnect = (nodeId: any, serverLabel: any) => {
    Connect(nodeId)
      .then(() => {
        onGetImagesList(serverLabel);
      })
      .catch(e => {
        toast.error(`服务器连接失败：${e}`);
        return;
      });
  };

  const onGetImagesList = (serverLabel: string) => {
    GetImageList()
      .then(images => {
        setImagesTableData(images);
        setServerLabel(serverLabel);
      })
      .catch(e => {
        toast.error(`镜像列表获取失败：${e}`);
      });
  };

  useEffect(() => {
    onGetServers();
  }, []);

  const Folder: React.FC<any> = ({ showIcon }) => {
    if (showIcon) {
      return <IconFolderOpen />;
    }
    return <IconFolder />;
  };

  // Table 列渲染
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
          style={{ width: 80 }}
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

  const TableCreated: React.FC<any> = ({ text }) => {
    return <span>{moment.unix(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
  };

  const TableSize: React.FC<any> = ({ text }) => {
    return <span>{prettyBytes(text)}</span>;
  };

  const renderLabel = ({ data, className, onCheck, expandIcon }: RenderFullLabelProps) => {
    const { id, label } = data;
    const isFolder = data.type !== 'group';
    return (
      <Dropdown
        trigger={'contextMenu'}
        position={'bottom'}
        clickToHide={true}
        render={
          <Dropdown.Menu>
            {isFolder && (
              <Dropdown.Item onClick={() => onConnect(rightSelect, selectedLabel)}>
                <IconLink />
                连接服务
              </Dropdown.Item>
            )}
            <Dropdown.Item>
              <IconEdit />
              编辑名称
            </Dropdown.Item>
            <Dropdown.Item>
              <IconDelete style={{ color: 'var(--semi-color-danger)' }} />
              <span style={{ color: 'var(--semi-color-danger)' }}>删除节点</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <li
          role="tree"
          className={`${className} flex justify-between h-[30px]`}
          onClick={v => {
            onCheck(v);
            setSelectedLabel(label?.toString() || null);
          }}
          onContextMenu={v => {
            onCheck(v);
            setSelectedLabel(label?.toString() || null);
            setRightSelect(id);
          }}
        >
          <div className="flex items-center">
            {isFolder ? null : expandIcon}
            {isFolder ? (
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
        </li>
      </Dropdown>
    );
  };

  const onDrop = (info: OnDragProps) => {
    const { node, dropToGap, dragNode } = info;

    // 如果当前节点的类型不是分组并且拖拽操作是需要把某个节点放入当前节点，那么就提示错误
    if (node.type !== 'group' && !dropToGap) {
      toast.error('当前节点不是分组，不能放入!');
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
    console.log(info);
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
            draggable
            onDrop={onDrop}
            className="flex-grow h-0"
            expandAll={false}
            treeData={treeData}
            filterTreeNode
            showClear
            showFilteredOnly={true}
            renderFullLabel={renderLabel}
            onExpand={(_, expanded) => setFolderStatus(expanded.expanded)}
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
      <div className="flex flex-grow h-full w-full">
        {serverLabel ? (
          <div className="overflow-auto max-h-full w-full">
            <div className="ml-4 mt-4 mr-4 mb-1">
              <Card title={`Docker Server ${serverLabel}`}>docker</Card>
            </div>
            <div className="ml-4 mt-4 mr-4 mb-3 flex-grow">
              <Card title="Docker Images">
                <Table dataSource={imagesTableData} pagination={true}>
                  <Column title="Repository" dataIndex="name" key="name" />
                  <Column title="Tag" dataIndex="tag" key="tag" />
                  <Column title="Image ID" dataIndex="id" key="id" render={text => <TablesHash text={text} />} />
                  <Column
                    title="Created"
                    dataIndex="created"
                    key="created"
                    render={text => <TableCreated text={text} />}
                  />
                  <Column title="Size" dataIndex="size" key="size" render={text => <TableSize text={text} />} />
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
    </div>
  );
}
