import { WindowMinimise, Quit, WindowIsMaximised, WindowMaximise, WindowUnmaximise } from '@wailsApp/runtime';
import Logo from '@/assets/images/logo.ico';
import { GetSysVersion } from '@wailsApp/go/services/Preferences';
import { useEffect, useState } from 'react';
import { IconClose, IconCheckboxIndeterminate, IconMaximize } from '@douyinfe/semi-icons';

export default function Header() {
  const reduction = () => {
    WindowIsMaximised().then(res => {
      if (res) {
        WindowUnmaximise();
      } else {
        WindowMaximise();
      }
    });
  };

  const [sysVersion, setSysVersion] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (ua.includes('wails.io')) {
      GetSysVersion().then(res => {
        setSysVersion(res);
      });
    }
  }, []);

  if (sysVersion === 'darwin') {
    return (
      <div className="flex h-full justify-center items-center">
        <div className="flex items-center justify-center">
          <img src={Logo} alt="Logo" style={{ width: 24, height: 24 }} />
          <span className="pl-2 text-base font-semibold">Docker Link</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2">
        <div className="pl-2 flex">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" style={{ width: 24, height: 24 }} />
            <span className="pl-2 text-base font-semibold">Docker Link</span>
          </div>
        </div>
        <div className="justify-self-end">
          <div className="flex items-center mt-0">
            <div onClick={WindowMinimise} className="w-12 h-12 flex items-center justify-center hover:bg-custom-hover">
              <IconCheckboxIndeterminate style={{ color: 'var(--semi-color-text-2)' }} />
            </div>

            <div onClick={reduction} className="w-12 h-12 flex items-center justify-center hover:bg-custom-hover">
              <IconMaximize style={{ color: 'var(--semi-color-text-2)' }} />
            </div>

            <div
              onClick={Quit}
              className="w-12 h-12 flex items-center justify-center hover:bg-close-hover hover:rounded-tr-md"
            >
              <IconClose style={{ color: 'var(--semi-color-text-2)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
