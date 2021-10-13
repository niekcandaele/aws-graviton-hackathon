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
  icon: string;
  position: { x: number; y: number; z: number };
  prediction?: {
    team: IRichTeam;
    certainty: number;
  };
  original: any
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
        icon: '💣',
        position: bombStatusChange.position,
        component: (<div><Player player={bombStatusChange.player.player} teams={teams} playerInfo={bombStatusChange.player}/> {bombStatusChange.status} the bomb.</div>),
        original: bombStatusChange
      });
    } else {
      events.push({
        time: bombStatusChange.tick,
        icon: '💣',
        position: bombStatusChange.position,
        component: `${bombStatusChange.status} the bomb.`,
        original: bombStatusChange
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
      icon: '🔫',
      position: kill.attacker.position,
      component: (<div> <Player player={kill.attacker.player} teams={teams} playerInfo={kill.attacker}/>  killed <Player player={kill.victim.player} teams={teams} playerInfo={kill.victim}/> with {kill.attacker.weapon} </div>),
      original: kill
    });
  });

  round.grenades.forEach((grenade) => {
    events.push({
      time: grenade.tick,
      icon: '💥',
      position: grenade.position,
      component: (<div><Player player={grenade.attacker.player} teams={teams} playerInfo={grenade.attacker}/>  detonated a {grenade.type} grenade </div>),
      original: grenade
    });
  });

  round.chickenDeaths.forEach((chickenDeath) => {
    events.push({
      time: chickenDeath.tick,
      icon: '🐔',
      position: chickenDeath.position,
      component: (<div><Player player={chickenDeath.attacker.player} teams={teams} playerInfo={chickenDeath.attacker}/>  killed a chicken </div>),
      original: chickenDeath
    });
  });

  round.playerBlinds.forEach((playerBlind) => {
    if (!playerBlind.victim.player) {
      return;
    }

    events.push({
      time: playerBlind.tick,
      icon: '🔦',
      position: playerBlind.victim.position,
      component: (<div><Player player={playerBlind.victim.player} teams={teams} playerInfo={playerBlind.victim}/>  was blinded by <Player player={playerBlind.attacker.player} teams={teams} playerInfo={playerBlind.attacker}/>for {Math.round(playerBlind.duration * 100) / 100} seconds</div>),
      original: playerBlind
    });

  });

  events.sort((a, b) => a.time - b.time);

  const winningTeam = props.teams.find((t) => t.id === round.winningTeam);

  events.push({
    time: events[events.length - 1].time + 10,
    icon: '🏆',
    position: { x: 0, y: 0, z: 0 },
    component: `Team ${winningTeam?.name} won the round`,
    original: null
  });

  const eventComponents = events.map((e) => {
    let prediction = null;
    
    if (e.original && e.original.prediction) {
      console.log(e.original.prediction);
      const team = teams.find(t => t.id === e.original.prediction.team_id);
      if (team) {
        prediction = (
          <Tooltip title={`${e.original.prediction.certainty * 100}% confidence`}>
            <span>PREDICTION: {team.name}</span>
          </Tooltip>
        );
      }
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
