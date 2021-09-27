import { faceitRequest } from './faceitRequest.mjs';

export async function getMatchesForHub(hubId) {
  const response = await faceitRequest(`/hubs/${hubId}/matches?type=past&offset=0&limit=10`)
  return response.data
}