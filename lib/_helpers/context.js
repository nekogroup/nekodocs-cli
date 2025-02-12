import inflection from 'inflection'

function pluralize(name) {
  let result = inflection.pluralize(name)
  if (result.endsWith('quipment')) result += 's'
  if (result === 'ais') result = 'ai'
  return result
}

export function genContext(cli) {
  if (cli.isContext) return cli
  const flags = cli.flags

  const firstParam = cli.input[1] || ''
  const mainParam = cli.input[1] || ''

  const ctx = {
    flags,
    libPath: cli.libPath,
    isContext: true,

    firstParam,
    mainParam,
    params: cli.input.slice(1),
  }

  return ctx
}
