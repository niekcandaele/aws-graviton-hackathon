import { Col, Row, Space, Table, Tag } from 'antd';
import { Alert, Spin } from 'antd';
import { Typography } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match } from '../../types/match';
import { getTeams } from '../lib/getTeams';
import { get } from '../lib/http';
import Loading from './Loading';

const { Title } = Typography;

interface IScoreboardProps {
  match: Match
}

interface IScoreboard {
  [key:string]: IPlayerOnScoreboard
}

interface IPlayerOnScoreboard {
  kills: number
  deaths: number
  id: string
  team: string
  name: string
}

function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

export default function Scoreboard(props: IScoreboardProps) {
  const [loading, setLoading] = useState(true);
  const [scoreboard, setScoreboard] = useState<IScoreboard>({});
  const { match } = props;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await get(`/matches/${match._id}/scoreboard`);
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
      dataIndex: 'name',
      key: 'name',
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
  const teams = getTeams(match);
  const dataTeam1 = players.filter((p) => p.team === teams[0].id);
  const dataTeam2 = players.filter((p) => p.team === teams[1].id);

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Title>{teams[0].name} - {teams[0].score}</Title>
          <Table
            columns={columns}
            dataSource={Object.values(dataTeam1)}
            pagination={false}
            sortDirections={['descend', 'ascend']}
          />
        </Col>
        <Col span={12}>
          <Title>{teams[1].name} - {teams[1].score}</Title>
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
