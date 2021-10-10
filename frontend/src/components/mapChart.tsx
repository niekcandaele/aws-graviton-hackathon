import { MapCountStats } from '@/lib/getStat';
import { Pie } from 'react-chartjs-2';

import { randomRGB } from '../lib/colours';

interface IMapChartProps {
  data: MapCountStats[];
}

export default function MapChart(props: IMapChartProps) {
  const style = {
    margin: 'auto',
    width: '50%',
    padding: '10px',
  };

  return (
    <Pie
      data={{
        datasets: [
          {
            data: props.data.map(d => d.value),
            backgroundColor: props.data.map(d => randomRGB()),
          },
        ],
        labels: props.data.map(d => d.label),
      }}
      width={500}
      height={500}
      options={{ maintainAspectRatio: false }}
    />
  );
}
