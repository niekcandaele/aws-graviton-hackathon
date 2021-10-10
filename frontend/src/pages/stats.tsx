import WinrateChart from '@/components/winrateChart';
import { Button, Col, Row, Statistic } from 'antd';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';

import { Result } from '../../types/stats';
import MapChart from '../components/mapChart';
import { getMapCount, getMapWinrates, getStat } from '../lib/getStat';
import { get } from '../lib/http';

const { Title } = Typography;

export default function Stats() {
  const [stats, setStats] = useState<Result[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get('/stats');
      setStats(response.data.result);
      setLoading(false);
    };
    fetchData();
  }, []);

  const mapCount = getMapCount(stats)
  const mapWins = getMapWinrates(stats)

  return (
    <div>
      <Title>Global stats</Title>

      <Row gutter={24} justify={'space-around'}>
        <Col span={8}>
          <Statistic
            title="Total matches"
            value={getStat(stats, 'matches_total')}
            loading={loading}
          />
        </Col>
        <Col span={8}>
           <Statistic title="Chickens killed" value={getStat(stats, 'chickenDeaths_total')} /> 
        </Col>
        <Col span={8}>
          <Statistic
            title="Total rounds"
            value={getStat(stats, 'rounds_total')}
            loading={loading}
          />
        </Col>
      </Row>

      <Row>
        <Title>Map division</Title>
        <Col span={24}>
          <MapChart data={mapCount}></MapChart>
        </Col>
      </Row>

      <Row>
        <Title>Map winrate by side</Title>
        <Col span={24}>
          <WinrateChart data={mapWins}/>
        </Col>
      </Row>

    </div>
  );
}
