import { Card } from '@douyinfe/semi-ui';
import { IconServer, IconHelm, IconKanban, IconCloud } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';
import ReactECharts, { EChartsInstance } from 'echarts-for-react';
import { useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';

export default function Dashboard() {
  const { t } = useTranslation();

  const containerStatusOption = {
    title: {
      text: 'Container Status',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      extraCssText: 'box-shadow:none;',
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
            shadowBlur: 0,
          },
        },
      },
    ],
  };

  // const networkFlowOption = {
  //   title: {
  //     text: 'Network Flow',
  //     left: 'center',
  //   },
  //   tooltip: {
  //     trigger: 'item',
  //     extraCssText: 'box-shadow:none;',
  //   },
  //   xAxis: {
  //     type: 'category',
  //     boundaryGap: false,
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //   },
  //   yAxis: {
  //     type: 'value',
  //   },
  //   series: [
  //     {
  //       data: [120, 132, 101, 34, 290, 330, 320],
  //       type: 'line',
  //       areaStyle: {},
  //     },
  //     {
  //       data: [120, 232, 201, 134, 190, 130, 132],
  //       type: 'line',
  //       areaStyle: {},
  //     },
  //   ],
  // };

  const containerStatusRef = useRef<EChartsInstance>();
  // const networkFlowRef = useRef<EChartsInstance>();
  const chartRef2 = useRef<EChartsInstance>();

  const body = document.body;
  // TODO: 根据主题状态变化触发setChartTheme
  const [chartTheme, setChartTheme] = useState(body.hasAttribute('theme-mode') ? 'dark' : 'light');

  useEffect(() => {
    const handleResize = throttle(() => {
      if (containerStatusRef.current) containerStatusRef.current.resize();
      // if (networkFlowRef.current) networkFlowRef.current.resize();
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
            <ReactECharts theme={chartTheme} ref={containerStatusRef} option={containerStatusOption} />
          </Card>
        </div>
        <div className="basis-1/2">
          <Card>
            <ReactECharts theme={chartTheme} ref={chartRef2} option={containerStatusOption} />
          </Card>
        </div>
      </div>

      {/* <div className="gap-4 m-4">
        <Card>
          <ReactECharts theme={chartTheme} ref={networkFlowRef} option={networkFlowOption} />
        </Card>
      </div> */}
    </>
  );
}
