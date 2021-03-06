import { getTeams } from '@/lib/getTeams';
import { Col, Collapse, Row, Space, Table, Tag } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match } from '../../types/match';
import { get } from '../lib/http';
import Loading from './Loading';
import Round from './Round';

const { Panel } = Collapse;
interface IRoundListing {
  match: Match | undefined;
}

export default function RoundListing(props: IRoundListing) {
  const { match } = props;

  if (!match) {
    return <Loading />;
  }

  const roundsListing = match.rounds.map((round, idx) => (
    <Panel header={`Round ${idx + 1} - ${Math.round((round.officialEndTick - round.startTick) / 120)} seconds`} key={idx + 1} >
      <Round roundId={round._id} map={match.map} teams={getTeams(match)}/>
    </Panel>
  ));

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
          {roundsListing}
      </Collapse>
    </div>
  );
}
