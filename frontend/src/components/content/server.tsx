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
} from '@douyinfe/semi-icons';
import React, { useState } from 'react';
import { RenderFullLabelProps } from '@douyinfe/semi-ui/lib/es/tree';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';

type FolderProps = {
  showIcon: boolean;
};

export default function Server() {
  const { Column } = Table;
  const { Paragraph, Text } = Typography;
  const [serverValue, setServerValue] = useState('');
  const [folderStatus, setFolderStatus] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const serverListStyle = {
    backgroundColor: 'var(--semi-color-bg-0)',
    borderRight: '1px solid var(--semi-color-border)',
  };

  // Virtual data
  const generateData = (count: number) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const ipParts = ['127', '0', '0', i + 1];
      const ip = ipParts.join('.');
      if (i === 0) {
        data.push({
          label: 'localhost',
          value: 'localhost',
          key: `${i}`,
          children: [
            {
              label: '192.168.1.1',
              value: '192.168.1.1',
              key: '0-0-1',
            },
          ],
        });
      } else {
        data.push({
          label: ip,
          value: ip,
          key: `${i}`,
        });
      }
    }
    return data;
  };
  const data = generateData(10);

  const generatetableData = () => {
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
  }
  const tableData = generatetableData();

  const Folder: React.FC<FolderProps> = ({ showIcon }) => {
    if (showIcon) {
      return <IconFolderOpen />;
    }
    return <IconFolder />;
  };

  const Action: React.FC = () => {
    return (
      <ButtonGroup size="small" theme="borderless">
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
          console.log(data);
          onCheck(v);
          setSelectedLabel(label?.toString() || null);
        }}
      >
        <div className="flex items-center">
          {isLeaf ? null : expandIcon}
          {isLeaf ? (
            <div className="ml-5 mr-1 flex" style={{ color: 'var(--semi-color-text-2)' }}>
              <IconServer />
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
            <Action />
          </div>
        )}
      </li>
    );
  };

  // @ts-ignore
  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-none w-80 h-full" style={serverListStyle}>
        <div className="flex flex-col h-full">
          <Tree
            className="flex-grow h-0"
            expandAll={false}
            treeData={data}
            filterTreeNode
            showClear
            onChange={v => setServerValue(v ? v.toString() : '')}
            showFilteredOnly={true}
            renderFullLabel={renderLabel}
            onExpand={() => setFolderStatus(!folderStatus)}
          />
          <div
            className="flex flex-row h-12 flex-shrink-0 items-center justify-between"
            style={{ borderTop: '1px solid var(--semi-color-border)' }}
          >
            <div className="flex ml-2">
              <Tooltip content={'添加新连接'}>
                <div className="w-11 h-9 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer">
                  <IconCopyAdd style={{ color: 'var(--semi-color-text-2)' }} size="large" />
                </div>
              </Tooltip>
              <Tooltip content={'添加新分组'}>
                <div className="w-11 h-9 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer">
                  <IconFolderOpen style={{ color: 'var(--semi-color-text-2)' }} size="large" />
                </div>
              </Tooltip>
            </div>
            <div className="flex mr-2">
              <p style={{ color: 'var(--semi-color-text-2)' }}>Ver: 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
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
              title={'空空如也'}
              description="当前未选择服务器，请选择服务器"
            />
          </div>
        )}
      </div>
    </div>
  );
}
