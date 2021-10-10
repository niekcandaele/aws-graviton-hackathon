import { Result } from '../../types/stats';

export function getStat(stats: Result[] | undefined,name: string) {
  if (!stats) {
    return 0
  }

  const stat = stats.find(stat => stat.id.S === name);
  if (stat) {
    if (stat.data.M) {
      return stat.data.M;
    }
    return stat.data.N;
  }
  return 0;
}

export interface MapCountStats {
  label: string,
  value: number
}

export interface MapWinStats {
  label: string,
  value: {'COUNTER_TERRORIST': number, 'TERRORIST': number}
}

export function getMapCount(stats: Result[] | undefined) {
  const result: MapCountStats[] = []
  if (!stats) {
    return result;
  }

  const patternMatches = stats.filter(stat => stat.id.S.includes('mapcount'));

  for (const data of patternMatches) {
    result.push({label: data.id.S.replace('mapcount_', ''), value: parseInt(data.data.M.count.N, 10)})
  }

  return result;
}

export function getMapWinrates(stats: Result[] | undefined) {
  const result: MapWinStats[] = []
  if (!stats) {
    return result;
  }

  const patternMatches = stats.filter(stat => stat.id.S.includes('mapwinrate'));

  for (const data of patternMatches) {
    const ct = parseInt(data.data.M.COUNTER_TERRORIST.N, 10)
    const t = parseInt(data.data.M.TERRORIST.N,10)


    result.push({
      label: data.id.S.replace('mapwinrate_', ''), 
      value: {
        COUNTER_TERRORIST: ct / (ct + t) * 100,
        TERRORIST: t / (ct + t) * 100,
      }
    })
  }

  return result;
}