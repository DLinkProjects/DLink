import { useState } from 'react';
import { Card, CardGroup, Empty, ButtonGroup, Button, Typography } from '@douyinfe/semi-ui';
import { IconDelete, IconAlignBottom, IconPlus, IconUnlock } from '@douyinfe/semi-icons';
import CreateCert from './createCert';
import CertificateSvg from '@/assets/images/icons/certificate.svg?react';
import { IllustrationNoAccess, IllustrationNoAccessDark } from '@douyinfe/semi-illustrations';

export default function Key() {
  const { Meta } = Card;
  const [createCertVisible, setCreateCertVisible] = useState(false);
  const [isHovered, setIsHovered] = useState<null | number>(null);

  // MOCK
  const certList: string[] = [
    '192.168.1.10-cert',
    '192.168.3.5-cert',
    '192.168.0.99-cert',
    '192.168.4.20-cert',
    '192.168.2.15-cert',
    '192.168.5.30-cert',
    '192.168.0.2-cert',
    '192.168.3.45-cert',
    '192.168.1.25-cert',
  ];

  const handleMouseEnter = (key: number) => {
    setIsHovered(key);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    // 最顶层框架
    <div className="m-4" style={{ height: 'calc(100% - 2rem)' }}>
      {certList.length > 0 ? (
        <CardGroup spacing={10}>
          {certList.map((v, idx) => (
            <div
              key={idx}
              onMouseEnter={() => {
                handleMouseEnter(idx);
              }}
              onMouseLeave={handleMouseLeave}
            >
              <Card
                shadows="hover"
                style={{ maxWidth: 269, width: 269 }}
                bodyStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Meta
                  title={
                    <Typography.Text
                      ellipsis={{
                        showTooltip: {
                          opts: { content: v },
                        },
                      }}
                      style={{ width: 116 }}
                    >
                      {v}
                    </Typography.Text>
                  }
                  avatar={<CertificateSvg style={{ width: '1.5em', height: '1.5em' }} />}
                />

                {isHovered === idx && (
                  <ButtonGroup size="small" theme="borderless">
                    <Button icon={<IconAlignBottom />} />
                    <Button type="danger" icon={<IconDelete />} />
                  </ButtonGroup>
                )}
              </Card>
            </div>
          ))}
          <span onClick={() => setCreateCertVisible(true)}>
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
              <IconPlus size="extra-large" />
            </Card>
          </span>
        </CardGroup>
      ) : (
        <div className="flex flex-col flex-grow h-full w-full items-center justify-center">
          <Empty
            image={<IllustrationNoAccess style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationNoAccessDark style={{ width: 150, height: 150 }} />}
            title="暂无证书"
            description="开始创建你的第一个证书吧！"
          ></Empty>
          <Button className="mt-4" icon={<IconUnlock />} type="primary" onClick={() => setCreateCertVisible(true)}>
            创建证书
          </Button>
        </div>
      )}

      <CreateCert visible={createCertVisible} setVisible={setCreateCertVisible} />
    </div>
  );
}
