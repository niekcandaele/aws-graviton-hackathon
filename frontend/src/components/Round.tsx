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
  round: Round;
}

interface IEvent {
  time: number;
  description: string;
  icon: string;
}

export default function RoundDetails(props: IRound) {
  const { round } = props;

  if (!round) {
    return <Loading />;
  }

  const events: IEvent[] = [];

  round.bombStatusChanges.forEach((bombStatusChange) => {
    events.push({
      time: bombStatusChange.tick,
      description: `${bombStatusChange.player._id} ${bombStatusChange.status} the bomb.`,
      icon: '💣',
    });
  });

  round.kills.forEach((kill) => {
    events.push({
      time: kill.tick,
      description: `${kill.attacker.player} killed ${kill.victim.player} with ${kill.attacker.weapon}`,
      icon: '🔫',
    });
  });

  round.grenades.forEach((grenade) => {
    events.push({
      time: grenade.tick,
      description: `${grenade.attacker.player} detonated a ${grenade.type} grenade`,
      icon: '💥',
    });
  });

  round.chickenDeaths.forEach((chickenDeath) => {
    events.push({
      time: chickenDeath.tick,
      description: `${chickenDeath.attacker.player} killed a chicken`,
      icon: '🐔',
    });
  });

  round.playerBlinds.forEach((playerBlind) => {
    events.push({
      time: playerBlind.tick,
      description: `${playerBlind.victim.player} was blinded by ${playerBlind.attacker.player} for ${Math.round(playerBlind.duration * 100) / 100} seconds`,
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
