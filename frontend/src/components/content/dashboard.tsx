import { Card } from '@douyinfe/semi-ui';
import { IconServer, IconHelm, IconKanban } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-row gap-4 m-4">
        <div className="basis-1/4">
          <Card>
            <IconServer className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">服务器</div>
              <span className="text-4xl text-black">65</span>
            </div>
          </Card>
        </div>
        <div className="basis-1/4">
          <Card>
            <IconHelm className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">镜像</div>
              <span className="text-4xl text-black">65</span>
            </div>
          </Card>
        </div>
        <div className="basis-1/4">
          <Card>
            <IconKanban className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">容器</div>
              <span className="text-4xl text-black">65</span>
            </div>
          </Card>
        </div>
        <div className="basis-1/4">
          <Card>
            <IconServer className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">服务器数</div>
              <span className="text-4xl text-black">65</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="gap-4 m-4">
        <Card></Card>
      </div>
    </>
  );
}
