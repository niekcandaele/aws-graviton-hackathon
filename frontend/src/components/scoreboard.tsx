import { Col, Row, Space, Table, Tag } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match } from '../../types/match';
import { calculateScoreboard, IPlayerOnScoreboard } from '../lib/calculateScoreboard';
import { get } from '../lib/http';
import Loading from './Loading';

interface IScoreboardProps {
  matchId: string
}

function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

export default function Scoreboard(props: IScoreboardProps) {
  const [loading, setLoading] = useState(true);
  const [scoreboard, setScoreboard] = useState({});
  const { matchId } = props;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await get(`/matches/${matchId}/scoreboard`);
      setScoreboard(response.data.scoreboard);
      setLoading(false);
    };
    fetchData();
  }, []);


  if (!scoreboard || loading) {
    return <Loading description="Loading scoreboard"/>;
  }

  const columns = [
    {
      title: 'Player',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Kills',
      dataIndex: 'kills',
      key: 'kills',
      sorter: (a: IPlayerOnScoreboard, b: IPlayerOnScoreboard) =>
        a.kills - b.kills,
    },
    {
      title: 'Deaths',
      dataIndex: 'deaths',
      key: 'deaths',
      sorter: (a: IPlayerOnScoreboard, b: IPlayerOnScoreboard) =>
        a.deaths - b.deaths,
    },
  ];

  const players: IPlayerOnScoreboard[] = Object.values(scoreboard);
  const teams = players.map((p) => p.team).filter(onlyUnique);
  const dataTeam1 = players.filter((p) => p.team === teams[0]);
  const dataTeam2 = players.filter((p) => p.team === teams[1]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={Object.values(dataTeam1)}
            pagination={false}
            sortDirections={['descend', 'ascend']}
          />
        </Col>
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={Object.values(dataTeam2)}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
}
