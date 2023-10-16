import { Card } from '@douyinfe/semi-ui';
import { IconServer, IconHelm, IconKanban, IconCloud } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';
import ReactECharts, { EChartsInstance } from 'echarts-for-react';
import { useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import React from 'react';

export default function Dashboard() {
  const { t } = useTranslation();

  const option = {
    title: {
      text: 'Container Status',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 0, name: 'Created' },
          { value: 2, name: 'Running' },
          { value: 1, name: 'Restarting' },
          { value: 3, name: 'Removing' },
          { value: 4, name: 'Paused' },
          { value: 5, name: 'Exited' },
          { value: 6, name: 'Dead' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const chartRef1 = useRef<EChartsInstance>();
  const chartRef2 = useRef<EChartsInstance>();

  const body = document.body;
  // TODO: 根据主题状态变化触发setChartTheme
  const [chartTheme, setChartTheme] = useState(body.hasAttribute('theme-mode') ? 'dark' : 'light');

  useEffect(() => {
    const handleResize = throttle(() => {
      if (chartRef1.current) chartRef1.current.resize();
      if (chartRef2.current) chartRef2.current.resize();
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4 m-4">
        <div className="basis-1/4">
          <Card>
            <IconServer className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">服务器</div>
              <span className="text-4xl">65</span>
            </div>
          </Card>
        </div>
        <div className="basis-1/4">
          <Card>
            <IconHelm className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">镜像</div>
              <span className="text-4xl">65</span>
            </div>
          </Card>
        </div>
        <div className="basis-1/4">
          <Card>
            <IconKanban className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">容器</div>
              <span className="text-4xl">65</span>
            </div>
          </Card>
        </div>
        <div className="basis-1/4">
          <Card>
            <IconCloud className="text-6xl" />
            <div className="float-right text-center">
              <div className="text-current">存储卷</div>
              <span className="text-4xl">65</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-row gap-4 m-4">
        <div className="basis-1/2">
          <Card>
            <ReactECharts theme={chartTheme} ref={chartRef1} option={option} />
          </Card>
        </div>
        <div className="basis-1/2">
          <Card>
            <ReactECharts theme={chartTheme} ref={chartRef2} option={option} />
          </Card>
        </div>
      </div>
    </>
  );
}
