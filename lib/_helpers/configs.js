import { error } from 'shelljs'
import { flatten, is } from 'ramda'
import fg from 'fast-glob'
import yaml from 'js-yaml'

import fs from 'fs'
import path from 'path'

import { addRefOnYml } from './yml.js'
import logger from './logger.js'

const ROOT_PATH = './.nekodocs.yml'
const CONFIG_FILE_NAME = '.nekodocs.yml'
const BASE_PATH = process.cwd()

export function getRootConfigs() {
  if (!fs.existsSync(ROOT_PATH)) {
    logger.error(`${ROOT_PATH} file not found. Run "nekod init" on the root of the project`)
    return false
  }
  const content = fs.readFileSync(ROOT_PATH, 'utf8')
  const data = yaml.load(content)

  return data
}

export function getLocalDefsPaths() {
  const config = getRootConfigs()
  if (!config) return false

  if (!is(Array, config.paths)) {
    logger.error(`${ROOT_PATH} has no paths`)
    return false
  }

  const patterns = config.paths.map((path) => {
    if (!path.endsWith('/')) {
      path += '/'
    }

    return path + CONFIG_FILE_NAME
  })

  return fg.globSync(patterns, { absolute: true, deep: 100 })
}

export function getLocalDefsContent() {
  const defPaths = getLocalDefsPaths()
  if (!defPaths?.length) return false

  return defPaths.map((filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const formattedContent = addRefOnYmlsWhenNull(filePath, yaml.load(content))
      const folderPath = filePath.replace(CONFIG_FILE_NAME, '')
      const relativePath = path.relative(BASE_PATH, folderPath) + '/'
      return { ...formattedContent, path: folderPath, relativePath, defPath: filePath }
    } catch (error) {
      logger.error(`Error on reading file ${filePath}:`, error.message)
      throw error
    }
  })
}

export function getLocalPatternsContent() {
  const defs = getLocalDefsContent()

  return defs.map((def) => {
    const patterns = def.patterns.map((pattern) => `${def.path}/${pattern}`)
    console.log(1, patterns)
    const filePaths = fg.globSync(patterns, { absolute: true, deep: 100 })
    console.log(2, filePaths)
    if (!filePaths?.length) throw new Error('Files not found on patterns')

    const files = flatten(
      filePaths.map((filePath) => {
        const content = fs.readFileSync(filePath, 'utf8')
        const relativePath = path.relative(BASE_PATH, filePath)
        return { path: relativePath, content }
      })
    )

    return { def, filePaths, files }
  })
}

function addRefOnYmlsWhenNull(path, content) {
  const { ref } = content || {}
  if (!ref) {
    content = addRefOnYml(path, content)
  }
  return content
}
