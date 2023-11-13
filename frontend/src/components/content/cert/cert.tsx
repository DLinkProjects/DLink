import { useState } from 'react';
import { Card, CardGroup, Popover, Avatar } from '@douyinfe/semi-ui';
import { IconDelete, IconCopyAdd, IconKey } from '@douyinfe/semi-icons';

export default function Key() {
  const [spacing, setSpacing] = useState(10);
  const { Meta } = Card;

  return (
    // 最顶层框架
    <div className="m-4">
      <CardGroup spacing={spacing}>
        {new Array(8).fill(null).map((v, idx) => (
          <Card
            shadows="hover"
            style={{ maxWidth: 269, width: 269 }}
            bodyStyle={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Meta title="Docker Key" avatar={<IconKey size="extra-large" />} />
            <Popover position="top" showArrow content={<article style={{ padding: 4 }}>删除 key</article>}>
              <IconDelete style={{ color: 'var(--semi-color-danger)' }} />
            </Popover>
          </Card>
        ))}
        <Card
          style={{
            maxWidth: 269,
            width: 269,
          }}
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="border-dashed cursor-pointer hover:bg-tertiary-hover active:bg-tertiary-active custom-card"
        >
          <Popover position="top" showArrow content={<article style={{ padding: 4 }}>添加 Key</article>}>
            <IconCopyAdd size="extra-large" />
          </Popover>
        </Card>
      </CardGroup>
    </div>
  );
}
