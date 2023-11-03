import Layout from './components/layout/layout';
import { Trans } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    // TODO Semi 全局的语言切换没做
    <Trans>
        <Layout />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: 'var(--semi-color-bg-1)',
            color: 'var(--semi-color-text-0)',
          },
        }}
      />
    </Trans>
  );
}
