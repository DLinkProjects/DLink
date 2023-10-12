import { Tree, ButtonGroup, Button, Tooltip, Empty } from '@douyinfe/semi-ui';
import { IconServer, IconDelete, IconEdit, IconCopyAdd, IconFolderOpen, IconFolder } from '@douyinfe/semi-icons';
import React, { useState } from 'react';
import { RenderFullLabelProps } from '@douyinfe/semi-ui/lib/es/tree';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Card } from '@douyinfe/semi-ui';
import { Table } from '@douyinfe/semi-ui';

type FolderProps = {
  showIcon: boolean;
};

export default function Server() {
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
            {
              label: '192.168.1.2',
              value: '192.168.1.2',
              key: '0-0-2',
            },
            {
              label: '192.168.1.3',
              value: '192.168.1.3',
              key: '0-0-3',
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
  const columns = [
    {
      title: '标题',
      dataIndex: 'name',
    },
    {
      title: '大小',
      dataIndex: 'size',
    },
    {
      title: '所有者',
      dataIndex: 'owner',
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
    },
  ];
  const tableData = [
    {
      key: '1',
      name: 'Semi Design 设计稿.fig',
      nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png',
      size: '2M',
      owner: '姜鹏志',
      updateTime: '2020-02-02 05:13',
      avatarBg: 'grey',
    },
    {
      key: '2',
      name: 'Semi Design 分享演示文稿',
      nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
      size: '2M',
      owner: '郝宣',
      updateTime: '2020-01-17 05:31',
      avatarBg: 'red',
    },
  ];

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
              <Card title={`Docker Server ${serverValue}`}>
                Semi Design 是由互娱社区前端团队与 UED
                团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                Web 应用。
              </Card>
            </div>
            <div className="ml-4 mt-4 mr-4 mb-3 flex-grow">
              <Card title="Docker Images">
                <Table columns={columns} dataSource={tableData} pagination={false} />
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
