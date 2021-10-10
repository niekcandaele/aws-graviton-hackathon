import { Table } from 'antd';
import { Alert, Spin } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Match } from '../../types/match';
import { get } from '../lib/http';

interface ILoadingProps {
  description?: string
}


export default function Loading(props: ILoadingProps) {
  const style = {
    margin: "auto",
    width: "100%",
    padding: "10px",
  }


    return (
      <Spin style={style} tip={props.description ? props.description :  "Further details about the context of this alert."} />
    );
}

