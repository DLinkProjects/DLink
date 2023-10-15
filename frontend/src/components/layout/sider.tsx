import { Nav } from '@douyinfe/semi-ui';
import {
  IconGithubLogo,
  IconSetting,
  IconDesktop,
  IconAppCenter,
  IconHistory,
  IconDuration,
  IconSun,
  IconServer,
  IconInfoCircle,
} from '@douyinfe/semi-icons';
import { BrowserOpenURL } from '@wailsApp/runtime';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Preferences from '@/components/settings/preferences';
import About from '../settings/about';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Sider() {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(['dashboard']);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  useState(<IconDuration style={{ color: 'var(--semi-color-text-2)' }} size="large" />);
  const controlsSun = useAnimation();
  const controlsMoon = useAnimation();

  const dashboard = t('dashboard');
  const servers = t('servers');
  const container = t('container');
  const log = t('log');

  const navItems = [
    { itemKey: 'dashboard', text: dashboard, icon: <IconDesktop /> },
    { itemKey: 'server', text: servers, icon: <IconServer /> },
    { itemKey: 'container', text: container, icon: <IconAppCenter /> },
    { itemKey: 'log', text: log, icon: <IconHistory /> },
  ];

  const switchMode = () => {
    const body = document.body;

    if (body.hasAttribute('theme-mode')) {
      body.removeAttribute('theme-mode');
      controlsSun.start({ rotateY: 0 });
      controlsMoon.start({ rotateY: -180 });
    } else {
      body.setAttribute('theme-mode', 'dark');
      controlsSun.start({ rotateY: 180 });
      controlsMoon.start({ rotateY: 0 });
    }
  };

  // 监听系统主题变化
  useEffect(() => {
    type MediaQueryListEvent = {
      matches: boolean;
      media: string;
    };

    const mql: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    function matchMode(e: MediaQueryListEvent): void {
      const body: HTMLElement = document.body;

      if (e.matches) {
        if (!body.hasAttribute('theme-mode')) {
          body.setAttribute('theme-mode', 'dark');
        }
      } else {
        if (body.hasAttribute('theme-mode')) {
          body.removeAttribute('theme-mode');
        }
      }
    }
    mql.addEventListener('change', matchMode);
  });

  const onNavSelect = (key: any) => {
    navigator('/' + key.itemKey);
    setSelectedKeys([key.itemKey]);
  };

  const onOpenGithub = () => {
    BrowserOpenURL('https://github.com/DLinkProjects/DLink');
  };

  const onOpenSetting = () => {
    setSettingsVisible(true);
  };

  const onOpenAbout = () => {
    setAboutVisible(true);
  };

  return (
    <div className="flex flex-col h-[100%]">
      <div className="flex-grow">
        <Nav
          onClick={key => onNavSelect(key)}
          selectedKeys={selectedKeys}
          className="border-0"
          style={{ width: 59 }}
          items={navItems}
          isCollapsed={true}
          defaultIsCollapsed={true}
        />
      </div>
      <div className="pb-12 flex flex-col justify-center items-center">
        <motion.div
          whileHover={{ rotate: 360 }} // 当鼠标悬停在上面时放大1.5倍并旋转360度
          transition={{ duration: 0.5, ease: 'easeOut' }} // 过渡效果
          onClick={onOpenGithub}
          className="w-11 h-9 mt-2 flex justify-center items-center cursor-pointer"
        >
          <IconGithubLogo style={{ color: 'var(--semi-color-text-2)' }} size="large" />
        </motion.div>
        <div
          onClick={onOpenSetting}
          className="w-11 h-9 mt-2 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer"
        >
          <IconSetting style={{ color: 'var(--semi-color-text-2)' }} size="large" />
        </div>
        <div
          onClick={switchMode}
          className="w-11 h-9 mt-2 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer position-relative"
        >
          <motion.div
            animate={controlsSun}
            transition={{ duration: 1 }} // 设置动画持续时间为2秒
            className="absolute"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <IconDuration style={{ color: 'var(--semi-color-text-2)' }} size="large" />
          </motion.div>
          <motion.div
            animate={controlsMoon}
            initial={{ rotateY: -180 }}
            transition={{ duration: 1 }} // 设置动画持续时间为2秒
            className="absolute"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <IconSun style={{ color: 'var(--semi-color-text-2)' }} size="large" />
          </motion.div>
        </div>
        <div
          onClick={onOpenAbout}
          className="w-11 h-9 mt-2 flex justify-center items-center hover:bg-custom-hover rounded cursor-pointer"
        >
          <IconInfoCircle style={{ color: 'var(--semi-color-text-2)' }} size="large" />
        </div>
      </div>
      <Preferences visible={settingsVisible} setVisible={setSettingsVisible} />
      <About visible={aboutVisible} setVisible={setAboutVisible} />
    </div>
  );
}
