import meow from 'meow'

import gen from './gen/gen.js'
import init from './setup/init.js'
import logger from '../_helpers/logger.js'

const HELP = `Usage

Setup
  $ nekod init

Documentation
  $ nekod run
`

export default function main(LIB_PATH) {
  const cli = meow(HELP, {
    importMeta: import.meta,
    flags: {
      path: { type: 'string', shortFlag: 'p' },
    },
  })
  cli.libPath = LIB_PATH

  const [comand] = cli.input

  switch (comand) {
    case 'init':
      return init(cli)

    case 'run':
      return gen(cli)

    case 'gen':
      return gen(cli)

    default:
      logger.boldInfo('NEKO DOCS CLI')
      logger.error('Command not found')
      logger.info(HELP)
  }
}
