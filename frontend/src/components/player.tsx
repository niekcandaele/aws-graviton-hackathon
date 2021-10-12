import { IRichTeam } from '@/lib/getTeams';
import { Tag } from 'antd';
import { Player as PlayerType } from 'types/RoundResponse';

interface IPlayerProps {
  player: PlayerType
  teams: IRichTeam[]
}

export default function Player(props: IPlayerProps) {
  const {player,teams} = props;
  const name = player.name ? player.name : 'Anonymous';

  const colour = teams.find(team => team.players.includes(player._id))?.colour;

  return <Tag color={colour}>{name}</Tag>;
}
