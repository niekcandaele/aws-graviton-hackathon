import { Table } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { get } from '../../lib/http';
import { Match } from '../../types/match';

interface ILoadingProps {
  description?: string
}


export default function Loading(props: ILoadingProps) {
    return (
      <Spin tip="Loading...">
        <Alert
          message="Loading"
          description={props.description ? props.description :  "Further details about the context of this alert."}
          type="info"
        />
      </Spin>
    );
}
