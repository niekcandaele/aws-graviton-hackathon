import { Table } from 'antd';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { get } from '../../lib/http';
import { Match } from '../../types/match';

export default function Index() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const response = await get('/matches', { page: page, limit: limit });
      setMatches(response.data.matches.docs);
      setTotal(response.data.matches.total);
      setLoading(false);
    };
    fetchData();
  }, [page, limit]);

  const columns = [
    {title: 'ID', dataIndex: '_id', key: 'id'},
    {title: 'Map', dataIndex: 'map', key: 'map'},
    {title: 'Date', dataIndex: 'date', key: 'date', render: (date: string) => format(new Date(date), 'HH:mm dd/MM/yyyy')},
  ]

  const onTableChange = (pagination: any,) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  }

  return (
    <div>
      <h1>Matches</h1>

      <Table 
      dataSource={matches} 
      columns={columns} 
      onChange={onTableChange}
      pagination={{total: total, pageSize: limit, current: page}}
      loading={loading}
      />;
    </div>
  );
}
