import {DataPoint} from './types';

const DATA_SERVER_API = 'http://192.168.31.100:3000';

export const getGraphData = async () => {
  const res = await fetch(DATA_SERVER_API);
  const json = res.json() as unknown;
  return json as DataPoint[];
};
