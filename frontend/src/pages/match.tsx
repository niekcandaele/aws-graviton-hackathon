import Loading from '@/components/Loading';
import RoundListing from '@/components/RoundListing';
import Scoreboard from '@/components/scoreboard';
import { Col, Divider, Row, Statistic, Table } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match } from '../../types/match';
import { get } from '../lib/http';

interface IMatchDetailProps {
  match: { params: { id: string } };
}

export default function MatchDetails(props: IMatchDetailProps) {
  const [match, setMatch] = useState<Match>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const response = await get(`/matches/${props.match.params.id}`);
      setMatch(response.data.match);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !match) {
    return <Loading description="Crunching the numbers! 🤓"/>;
  }

  const chickenKills = match.rounds.reduce((acc, round) => {
    return acc + round.chickenDeaths.length;
  }, 0);

  return (
    <div>
      <h1>Match details</h1>
      <Row gutter={24} justify={'space-around'}>
        <Col span={8}>
          <Statistic title="Rounds" value={match.rounds.length} />
        </Col>
        <Col span={8}>
          <Statistic title="Chickens killed" value={chickenKills} />
        </Col>
        <Col span={8}>
          <Statistic title="Date" value={formatDistance(subDays(new Date(), 1), new Date(match.date)) + ' ago'} />
        </Col>
      </Row>

      <Scoreboard match={match} />

      <Divider/>

      <RoundListing match={match} />

    </div>
  );
}
