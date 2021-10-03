import { Col, Row, Space, Table, Tag } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match } from '../../types/match';
import { calculateScoreboard, IPlayerOnScoreboard } from '../lib/calculateScoreboard';
import { get } from '../lib/http';
import Loading from './Loading';

interface IScoreboardProps {
  match: Match | undefined;
}

export default function Scoreboard(props: IScoreboardProps) {
  const [loading, setLoading] = useState(true);
  const { match } = props;

  if (!match) {
    return <Loading />;
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

  const scoreboard = calculateScoreboard(match);
  const players = Object.values(scoreboard);
  const teams = match.teams.map((t) => t._id);
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
