import { Table } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { get } from '../../lib/http';
import { Match } from '../../types/match';
import Loading from './Loading';

interface IScoreboardProps {
  match: {params: {id: string}};
}


export default function Scoreboard(props: IScoreboardProps) {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div>
      <h1>Scoreboard</h1>
    </div>
  );
}
