import { useState } from 'react';
import { Card, CardGroup, Popover, ButtonGroup, Button } from '@douyinfe/semi-ui';
import { IconDelete, IconCopyAdd, IconAlignBottom } from '@douyinfe/semi-icons';
import CreateCert from './createCert';
import CertificateSvg from '@/assets/images/icons/certificate.svg?react';

export default function Key() {
  const { Meta } = Card;
  const [createCertVisible, setCreateCertVisible] = useState(false);
  const [isHovered, setIsHovered] = useState<null | number>(null);

  const handleMouseEnter = (key: number) => {
    setIsHovered(key);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    // 最顶层框架
    <div className="m-4">
      <CardGroup spacing={10}>
        {new Array(8).fill(null).map((v, idx) => (
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
              <Meta title="Docker Key" avatar={<CertificateSvg style={{ width: '1.5em', height: '1.5em' }} />} />
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
            <IconCopyAdd size="extra-large" />
          </Card>
        </span>
      </CardGroup>
      <CreateCert visible={createCertVisible} setVisible={setCreateCertVisible} />
    </div>
  );
}
