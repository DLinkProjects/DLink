import Layout from './components/layout/layout';
import { Trans } from 'react-i18next';

export default function App() {
  return (
    // TODO Semi 全局的语言切换没做
    <Trans>
      <Layout />
    </Trans>
  );
}
