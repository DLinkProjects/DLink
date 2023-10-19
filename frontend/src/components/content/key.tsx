import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import { useTranslation } from 'react-i18next';

export default function Key() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-full flex-col">
      <Empty
        image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
        darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
        title={t('functionsUnderConstruction')}
        description={t('notYetOpen')}
      />
    </div>
  );
}
