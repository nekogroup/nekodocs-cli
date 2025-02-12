import yaml from 'js-yaml'

import { randomUUID } from 'crypto'
import fs from 'fs'

export function rewriteYml(path, content) {
  const ymlContent = yaml.dump(content, { noRefs: true })
  fs.writeFileSync(path, ymlContent, 'utf8')
}

export function addRefOnYml(path, content) {
  const newContent = { ref: randomUUID(), ...content }
  rewriteYml(path, newContent)
  return newContent
}
