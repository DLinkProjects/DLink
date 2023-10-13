import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center h-full flex-col">
      <Empty
        image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
        darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
        title={'功能建设中'}
        description="当前功能暂未开放，敬请期待。"
      />
    </div>
  );
}
