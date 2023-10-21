import { Tree, ButtonGroup, Button, Tooltip, Empty, Typography, Table, Card } from '@douyinfe/semi-ui';
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
import { getServers } from '@/api/server';
import AddServer from '@/components/content/servers/addServer';
import AddGroup from '@/components/content/servers/addGroup';

type FolderProps = {
  showIcon: boolean;
};

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
              parentId: item.parent_id,
              type: item.type,
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

  const Action: React.FC<any> = ({ serverValue, setServerValue, isFolder }) => {
    return (
      <ButtonGroup size="small" theme="borderless">
        {isFolder && <Button icon={<IconLink />} onClick={() => setServerValue(serverValue)} />}
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
    const isFolder = data.type !== 'group';

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

        {label === selectedLabel && (
          <div>
            <Action serverValue={label} setServerValue={setServerValue} isFolder={isFolder} />
          </div>
        )}
      </li>
    );
  };

  const onDrop = (info: OnDragProps) => {
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
      <AddServer visible={addServerVisible} setVisible={setAddServerVisible} onGetServers={onGetServers} />
      <AddGroup visible={addGroupVisible} setVisible={setAddGroupVisible} onGetServers={onGetServers} />
    </div>
  );
}
