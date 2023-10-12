import { Layout as SemiLayout } from '@douyinfe/semi-ui';
import Header from './header';
import Sider from './sider';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const { Header: SemiHeader, Sider: SemiSider, Content: SemiContent } = SemiLayout;

  const headerStyle = {
    height: '48px',
    '--wails-draggable': 'drag',
    backgroundColor: 'var(--semi-color-bg-0)',
    borderTop: '1px solid var(--semi-color-border)',
    borderLeft: '1px solid var(--semi-color-border)',
    borderRight: '1px solid var(--semi-color-border)',
  };

  const contentStyle = {
    height: 'calc(100vh - 48px)',
    lineHeight: '100%',
    width: 'calc(100vw - 60px)',
    backgroundColor: 'var(--semi-color-bg-1)',
    border: '1px solid var(--semi-color-border)',
  };

  const siderStyle = {
    width: '60px',
    backgroundColor: 'var(--semi-color-bg-1)',
    borderLeft: '1px solid var(--semi-color-border)',
    borderTop: '1px solid var(--semi-color-border)',
    borderBottom: '1px solid var(--semi-color-border)',
  };

  return (
    <>
      <SemiLayout style={{ height: '100vh' }}>
        <SemiHeader style={headerStyle} className="rounded-t-lg">
          <Header />
        </SemiHeader>
        <SemiLayout>
          <SemiSider style={siderStyle} className="rounded-bl-lg">
            <Sider />
          </SemiSider>
          <SemiContent style={contentStyle} className="rounded-br-lg">
            <Outlet />
          </SemiContent>
        </SemiLayout>
      </SemiLayout>
    </>
  );
}
