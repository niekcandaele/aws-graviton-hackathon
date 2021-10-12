import { getTeams, IRichTeam } from '@/lib/getTeams';
import { Col, Collapse, Row, Space, Table, Tag, Timeline } from 'antd';
import { Alert, Spin } from 'antd';
import { Tooltip } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Team } from '../../types/match';
import { Round } from '../../types/RoundResponse';
import { get } from '../lib/http';
import HeatmapHandler from './heatmapHandler';
import Loading from './Loading';
import Player from './player';

const { Panel } = Collapse;
interface IRound {
  roundId: string;
  map: string;
  teams: IRichTeam[]
}

interface IEvent {
  time: number;
  component: React.ReactNode;
  description: string;
  icon: string;
  position: { x: number; y: number; z: number };
  prediction?: {
    team: IRichTeam;
    certainty: number;
  };
}

export default function RoundDetails(props: IRound) {
  const { roundId, teams } = props;
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
    if (bombStatusChange.player && bombStatusChange.player.player) {
      events.push({
        time: bombStatusChange.tick,
        description: `${bombStatusChange.player.player.name} ${bombStatusChange.status} the bomb.`,
        icon: '💣',
        position: bombStatusChange.position,
        component: (<div><Player player={bombStatusChange.player.player} teams={teams} /> {bombStatusChange.status} the bomb.</div>),
      });
    } else {
      events.push({
        time: bombStatusChange.tick,
        description: `${bombStatusChange.status} the bomb.`,
        icon: '💣',
        position: bombStatusChange.position,
        component: `${bombStatusChange.status} the bomb.`,
      });
    }
  });

  round.kills.forEach((kill) => {
    const team = props.teams.find((t) =>
      t.players.includes(kill.attacker.player._id),
    );

    if (!team) {
      return;
    }

    events.push({
      time: kill.tick,
      description: `killed ${kill.victim.player.name} with ${kill.attacker.weapon}`,
      icon: '🔫',
      position: kill.attacker.position,
      prediction: {
        team,
        certainty: kill.prediction.certainty,
      },
      component: (<div> <Player player={kill.attacker.player} teams={teams}/>  killed <Player player={kill.victim.player} teams={teams}/> with {kill.attacker.weapon} </div>),
    });
  });

  round.grenades.forEach((grenade) => {
    events.push({
      time: grenade.tick,
      description: `${grenade.attacker.player.name} detonated a ${grenade.type} grenade`,
      icon: '💥',
      position: grenade.position,
      component: (<div><Player player={grenade.attacker.player} teams={teams}/>  detonated a {grenade.type} grenade </div>),
    });
  });

  round.chickenDeaths.forEach((chickenDeath) => {
    events.push({
      time: chickenDeath.tick,
      description: `${chickenDeath.attacker.player.name} killed a chicken`,
      icon: '🐔',
      position: chickenDeath.position,
      component: (<div><Player player={chickenDeath.attacker.player} teams={teams}/>  killed a chicken </div>),
    });
  });

  round.playerBlinds.forEach((playerBlind) => {
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
      component: (<div><Player player={playerBlind.attacker.player} teams={teams}/>  {playerBlind.victim.player.name} was blinded by {
        playerBlind.attacker.player.name
      } for {Math.round(playerBlind.duration * 100) / 100} seconds</div>),
    });

  });

  events.sort((a, b) => a.time - b.time);

  const winningTeam = props.teams.find((t) => t.id === round.winningTeam);

  events.push({
    time: events[events.length - 1].time + 10,
    description: `Team ${winningTeam?.name} won the round`,
    icon: '🏆',
    position: { x: 0, y: 0, z: 0 },
    component: `Team ${winningTeam?.name} won the round`,
  });

  const eventComponents = events.map((e) => {
    let prediction;
    if (e.prediction) {
      prediction = (
        <Tooltip title={`${e.prediction.certainty * 100}% confidence`}>
          <span>PREDICTION: {e.prediction?.team.name}</span>
        </Tooltip>
      );
    } else {
      prediction = null;
    }

    return (
      <Timeline.Item key={e.time} dot={e.icon} label={prediction}>
        {e.component}
      </Timeline.Item>
    );
  });



  const heatmapData = events
    .filter((e) => e.position)
    .map((e) => {
      return [e.position.x, e.position.y, 1];
    });

  return (
    <Row>
      <Col span={12}>
        <Timeline mode="left">{eventComponents}</Timeline>
      </Col>
      <Col span={4}>
        <HeatmapHandler canvas="canvas" data={heatmapData} map={props.map} />
      </Col>
    </Row>
  );
}
