import { Button, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';

import { get } from '../lib/http';

interface IStats {
  totalMatches: number
}

export default function Stats() {
  const [stats, setStats] = useState<IStats>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get('/stats');
      setStats(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Stats</h1>
          <Statistic title="Total matches" value={loading ? 0 : stats.totalMatches} loading={loading} />
    </div>
  );
}
