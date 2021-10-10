import { Col, Collapse, Row, Space, Table, Tag, Timeline } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match, Round } from '../../types/match';
import { calculateScoreboard, IPlayerOnScoreboard } from '../lib/calculateScoreboard';
import { get } from '../lib/http';
import HeatmapHandler from './heatmapHandler';
import Loading from './Loading';

const { Panel } = Collapse;
interface IRound {
  roundId: string;
  map: string
}

interface IEvent {
  time: number;
  description: string;
  icon: string;
  position: {x: number, y:number, z:number}
}

export default function RoundDetails(props: IRound) {
  const { roundId } = props;
  const [round, setRound] = useState<Round>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await get(`/rounds/${roundId}`);
      setRound(response.data.round);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !round) {
    return <Loading description="Loading round details" />;
  }

  const events: IEvent[] = [];

  round.bombStatusChanges.forEach((bombStatusChange) => {
    if (bombStatusChange.player.player) {
      events.push({
        time: bombStatusChange.tick,
        description: `${bombStatusChange.player.player.name} ${bombStatusChange.status} the bomb.`,
        icon: '💣',
        position: bombStatusChange.position
      });
    } else {
      events.push({
        time: bombStatusChange.tick,
        description: `${bombStatusChange.player._id} ${bombStatusChange.status} the bomb.`,
        icon: '💣',
        position: bombStatusChange.position
      });
    }
  });

  round.kills.forEach((kill) => {
    events.push({
      time: kill.tick,
      description: `${kill.attacker.player.name} killed ${kill.victim.player.name} with ${kill.attacker.weapon}`,
      icon: '🔫',
      position: kill.attacker.position,
    });
  });

  round.grenades.forEach((grenade) => {
    events.push({
      time: grenade.tick,
      description: `${grenade.attacker.player.name} detonated a ${grenade.type} grenade`,
      icon: '💥',
      position: grenade.position,
    });
  });

  round.chickenDeaths.forEach((chickenDeath) => {
    events.push({
      time: chickenDeath.tick,
      description: `${chickenDeath.attacker.player.name} killed a chicken`,
      icon: '🐔',
      position: chickenDeath.position,
    });
  });

  round.playerBlinds.forEach((playerBlind) => {
    console.log(playerBlind);

    if (!playerBlind.victim.player) {
      return;
    }

    events.push({
      time: playerBlind.tick,
      description: `${playerBlind.victim.player.name} was blinded by ${
        playerBlind.attacker.player.name
      } for ${Math.round(playerBlind.duration * 100) / 100} seconds`,
      icon: '🔦',
      position: playerBlind.victim.position,
    });
  });

  events.sort((a, b) => a.time - b.time);

  const eventComponents = events.map((e) => {
    return (
      <Timeline.Item key={e.time} dot={e.icon}>
        <p>{e.description}</p>
      </Timeline.Item>
    );
  });

  const heatmapData = events.filter(e => e.position).map(e => {
    return [e.position.x, e.position.y, 1];
  })

  return (
    <Row gutter={10} justify={'space-around'}>
      <Col span={6}>
        <Timeline>{eventComponents}</Timeline>
      </Col>
      <Col span={4} style={{marginRight: "20%"}}>
        <HeatmapHandler canvas="canvas" data={heatmapData} map={props.map}/>
      </Col>
    </Row>
  );
}
