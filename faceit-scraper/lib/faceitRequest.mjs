import axios from 'axios';


export async function faceitRequest(endpoint, params) {
  const faceitUrl = 'https://open.faceit.com/data/v4';
  const faceitApiKey = process.env.FACEIT_API
  
  const headers = { Authorization: `Bearer ${faceitApiKey}` }
  const response = await axios.get(`${faceitUrl}${endpoint}`, {headers});
  return response;
}