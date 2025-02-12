import { error } from 'shelljs'
import { prop } from 'ramda'
import zlib from 'zlib'

import { callAPI } from '../../_helpers/api.js'
import { getLocalPatternsContent } from '../../_helpers/configs.js'
import logger from '../../_helpers/logger.js'

// function valid() {
// if (!fs.existsSync('.nekodocs.yml')) {
// logger.error('.nekodocs.yml file not found. Run "nekod init" on the root of the project')
// return false
// }

// return true
// }

export default async function gen(cli) {
  logger.boldInfo(`[NEKODOCS] Generating docs`)
  // if (!valid()) return false
  const localDefs = getLocalPatternsContent()
  if (!localDefs) return
  const payload = formatPayload(localDefs)
  if (!payload) return

  // console.dir(payload, { depth: null, colors: true })
  const result = await callAPI('gen_docs', 'POST', payload)
}

function formatPayload(localDefs) {
  try {
    return localDefs.map((localDef) => {
      console.log(localDef.files.map(prop('path')))
      const jsonString = JSON.stringify(localDef.files)
      const compressed = zlib.gzipSync(jsonString)
      const base64Compressed = compressed.toString('base64')

      return {
        ref: localDef.def?.ref,
        name: localDef.def?.name,
        patterns: localDef.def?.patterns || [],
        instructions: localDef.def?.instructions || null,
        topic_name: localDef.def?.topic || null,
        tag_names: localDef.def?.tags || null,
        method: localDef.def?.method,
        path: localDef.def?.relativePath,
        files: base64Compressed,
      }
    })
  } catch (error) {
    logger.error('Error formating payload:', error.message)
  }
}
