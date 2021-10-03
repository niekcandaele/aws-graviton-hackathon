import axios, { AxiosRequestConfig } from 'axios';


export const httpClient = axios.create({
  baseURL: 'https://dn656qcaf2.execute-api.eu-west-1.amazonaws.com/prod',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export function get(endpoint: string, params?: Record<string, unknown>, reqOpts?: AxiosRequestConfig) {
  return httpClient.get(endpoint, {
    params,
    ...reqOpts,
  });
}