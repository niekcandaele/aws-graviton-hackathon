import { Table } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { get } from '../../lib/http';
import { Match } from '../../types/match';

interface IMatchDetailProps {
  match: {params: {id: string}};
}


export default function MatchDetails(props: IMatchDetailProps) {
  const [match, setMatch] = useState<Match>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const response = await get('/matches', { id: props.match.params.id });
      setMatch(response.data.matches.docs);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Spin tip="Loading...">
        <Alert
          message="Alert message title"
          description="Further details about the context of this alert."
          type="info"
        />
      </Spin>
    );
  }

  return (
    <div>
      <h1>Match details</h1>
      {JSON.stringify(match, null, 4)}
    </div>
  );
}
