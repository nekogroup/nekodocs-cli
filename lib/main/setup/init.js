import fs from 'fs'

import { createFile } from '../../_helpers/files.js'
import { genContext } from '../../_helpers/context.js'
import logger from '../../_helpers/logger.js'

const HELP = `Usage
  $ nekod init <account> <token>

Options
  --account: Account name copied from the docs.nekolibs.io
  --token: Auth token copied from the docs.nekolibs.io

Examples
  $ neko init DSAYt%$^46
`

function valid(ctx) {
  if (!!fs.existsSync('.nekodocs.yml')) {
    logger.error('.nekodocs.yml file already exists')
    return false
  }

  const [account, token] = ctx.params

  if (!account) {
    logger.error('Token missing')
    logger.info(HELP)
    return false
  }

  if (!token) {
    logger.error('Token missing')
    logger.info(HELP)
    return false
  }

  return true
}

const TEMPLATE = `token: $TOKEN$
account: $ACCOUNT$
paths:
  - lib/**
  - src/**
`

export default function init(cli) {
  logger.boldInfo(`[NEKODOCS] Setting up`)
  const ctx = genContext(cli)
  if (!valid(ctx)) return false
  const [account, token] = ctx.params

  createFile('.nekodocs.yml', TEMPLATE.replace('$TOKEN$', token).replace('$ACCOUNT$', account))
}
