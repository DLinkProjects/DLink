import { RadioGroup, Radio, Card, CardGroup, Typography } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { IconTick, IconCopy } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';

export default function Container() {
  const [viewSwitch, setviewSwitch] = useState('card');
  const { Paragraph, Title, Text } = Typography;
  const { t } = useTranslation();

  const card = t('card');
  const list = t('list');

  // MOCK
  const containerList = [
    {
      name: 'redis1',
      image: 'redis:latest',
      status: 'Running',
      cpu: '1.12%',
      port: '2023-10-11',
      latStarted: '2 days ago',
      hash: '067a81ed9c4f117bf1c63c7144b96f1f861288ad9359c04d4ea0bd64c85a0c26',
      key: '067a81ed9c4f117bf1c63c7144b96f1f861288ad9359c04d4ea0bd64c85a0c26',
    },
    {
      name: 'redis1',
      image: 'redis:latest',
      status: 'Running',
      cpu: '1.12%',
      port: '2023-10-11',
      latStarted: '2 days ago',
      hash: '067a81ed9c4f117bf1c63c7144b96f1f861288ad9359c04d4ea0bd64c85a0c25',
      key: '067a81ed9c4f117bf1c63c7144b96f1f861288ad9359c04d4ea0bd64c85a0c25',
    },
  ];

  let containerView: React.ReactNode;

  if (viewSwitch === 'card') {
    containerView = (
      <div className="flex">
        <CardGroup>
          {containerList.map(item => (
            <Card key={item.key} style={{ maxWidth: 360 }}>
              {/* <Meta title="Semi Doc" description="全面、易用、优质" /> */}
              <div className="flex flex-col">
                <span className="mb-1">
                  <Title heading={5}>{item.name}</Title>
                </span>
                <span>
                  <Text>{item.image}</Text>
                </span>
                <span className="mb-1">
                  <Text>
                    {item.port} {item.cpu}
                  </Text>
                </span>
                <span className="mb-1">
                  <Text>
                    {item.status} {item.latStarted}
                  </Text>
                </span>
                <Paragraph
                  copyable={{
                    content: item.hash,
                    successTip: <IconTick />,
                    icon: <IconCopy style={{ color: 'var(--semi-color-text-2)' }} />,
                  }}
                >
                  <Text
                    ellipsis={{
                      showTooltip: {
                        opts: { content: item.hash },
                      },
                    }}
                    style={{ width: 120 }}
                  >
                    {item.hash}
                  </Text>
                </Paragraph>
              </div>
            </Card>
          ))}
        </CardGroup>
      </div>
    );
  } else if (viewSwitch === 'list') {
    containerView = <div>列表视图</div>;
  }

  return (
    <div className="m-4 flex flex-col h-full" style={{ height: 'calc(100% - 2rem)' }}>
      <div>
        <RadioGroup
          type="button"
          onChange={v => setviewSwitch(v.target.value)}
          defaultValue={'card'}
          value={viewSwitch}
          aria-label="视图切换"
          name="view-switch"
        >
          <Radio value={'card'}>{card}</Radio>
          <Radio value={'list'}>{list}</Radio>
        </RadioGroup>
      </div>
      {/* TODO: 这里的高度有问题，应该是边框的高度没有被减去 */}
      <div className="mt-3 mb-4 flex-grow rounded-md">{containerView}</div>
    </div>
  );
}
