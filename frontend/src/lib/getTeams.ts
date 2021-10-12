import { Match } from '../../types/match';

const TEAM_NAMES = ['TEAM ONE', 'TEAM TWO'];

export interface IRichTeam {
  name: string;
  id: string,
  score: number;
  winner: boolean
  players: string[];
  colour: string
}

const colours = ['gold', 'blue']

export function getTeams(match: Match): IRichTeam[] {
  const teams: IRichTeam[] = match.teams.map((t, i) => {
    const score = match.rounds.filter(r => r.winningTeam === t._id).length;

    return {
      id: t._id,
      name: TEAM_NAMES[i],
      score,
      players: t.players
    }
  }) as IRichTeam[];
  
  if (teams[0].score > teams[1].score) {
    teams[0].winner = true;
  } else {
    teams[1].winner = true;
  }
  teams[0].colour = colours[0]
  teams[1].colour = colours[1]
  
  return teams ;
}