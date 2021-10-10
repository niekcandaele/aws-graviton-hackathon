import { MapWinStats } from '@/lib/getStat';
import { } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { randomRGB } from '../lib/colours';

interface IMapChartProps {
  data: MapWinStats[];
}

export default function WinrateChart(props: IMapChartProps) {
  return (
    <Bar
      data={{
        datasets: [
          {
            label: 'Terrorists',
            data: props.data.map(d => d.value.TERRORIST),
            backgroundColor: 'rgb(255,140,0)',
          },
          {
            label: 'Counter terrorists',
            data: props.data.map(d => d.value.COUNTER_TERRORIST),
            backgroundColor: 'rgb(0,255,255)',
          },
        ],
        labels: props.data.map(d => d.label),
      }}
      width={500}
      height={500}
      options={{ 
        maintainAspectRatio: false,
      }}
    />
  );
}
