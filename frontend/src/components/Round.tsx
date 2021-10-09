import { Col, Collapse, Row, Space, Table, Tag, Timeline } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match, Round } from '../../types/match';
import { calculateScoreboard, IPlayerOnScoreboard } from '../lib/calculateScoreboard';
import { get } from '../lib/http';
import Loading from './Loading';

const { Panel } = Collapse;
interface IRound {
  roundId: string;
}

interface IEvent {
  time: number;
  description: string;
  icon: string;
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
    return <Loading description="Loading round details"/>;
  }
  
  const events: IEvent[] = [];

  round.bombStatusChanges.forEach((bombStatusChange) => {
    if (bombStatusChange.player.player) {
      events.push({
        time: bombStatusChange.tick,
        description: `${bombStatusChange.player.player.name} ${bombStatusChange.status} the bomb.`,
        icon: '💣',
      });
    } else {
      events.push({
        time: bombStatusChange.tick,
        description: `${bombStatusChange.player._id} ${bombStatusChange.status} the bomb.`,
        icon: '💣',
      });
    }
  });

  round.kills.forEach((kill) => {
    events.push({
      time: kill.tick,
      description: `${kill.attacker.player.name} killed ${kill.victim.player.name} with ${kill.attacker.weapon}`,
      icon: '🔫',
    });
  });

  round.grenades.forEach((grenade) => {
    events.push({
      time: grenade.tick,
      description: `${grenade.attacker.player.name} detonated a ${grenade.type} grenade`,
      icon: '💥',
    });
  });

  round.chickenDeaths.forEach((chickenDeath) => {
    events.push({
      time: chickenDeath.tick,
      description: `${chickenDeath.attacker.player.name} killed a chicken`,
      icon: '🐔',
    });
  });

  round.playerBlinds.forEach((playerBlind) => {
    console.log(playerBlind)

    if (!playerBlind.victim.player) {
      return;
    }

    events.push({
      time: playerBlind.tick,
      description: `${playerBlind.victim.player.name} was blinded by ${playerBlind.attacker.player.name} for ${Math.round(playerBlind.duration * 100) / 100} seconds`,
      icon: '🔦',
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

  return (
    <Timeline>
      {eventComponents}
    </Timeline>
  );
}
