import Loading from '@/components/Loading';
import RoundListing from '@/components/RoundListing';
import Scoreboard from '@/components/scoreboard';
import { Col, Divider, Row, Statistic, Table } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

import chickenSfx from '../../public/Rooster-Crow.mp3';
import { Match } from '../../types/match';
import { get } from '../lib/http';

interface IMatchDetailProps {
  match: { params: { id: string } };
}

export default function MatchDetails(props: IMatchDetailProps) {
  const [match, setMatch] = useState<Match>();
  const [loading, setLoading] = useState(true);
  const [play] = useSound(chickenSfx);

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
    return <Loading description="Crunching the numbers! 🤓" />;
  }

  const chickenKills = match.rounds.reduce((acc, round) => {
    return acc + round.chickenDeaths.length;
  }, 0);

  const playChickenSound = () => {
    play();
  };

  return (
    <div>
      <h1>Match details</h1>
      <Row gutter={24} justify={'space-around'}>
        <Col span={8}>
          <Statistic title="Rounds" value={match.rounds.length} />
        </Col>
        <Col span={8} onMouseEnter={() => playChickenSound()}>
          <Statistic title="Chickens killed" value={chickenKills} />
        </Col>
        <Col span={8}>
          <Statistic
            title="Date"
            value={formatDistance(new Date(), new Date(match.date)) + ' ago'}
          />
        </Col>
      </Row>

      <Scoreboard matchId={match._id} />

      <Divider />

      <RoundListing match={match} />
    </div>
  );
}
