import { head } from 'ramda'

import { getRootConfigs } from './configs.js'

const API_URL = 'http://localhost:4000/rest/'

export function callAPI(path, method = 'GET', body) {
  const { account, token } = getRootConfigs()

  const data = {
    method,
    body: !!body ? JSON.stringify(body) : body,
    headers: {
      'Content-Type': 'application/json',
      subdomain: account,
      public_token: token,
    },
  }
  console.log(data)

  return fetch(API_URL + path, data)
}
