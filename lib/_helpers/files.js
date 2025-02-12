import { toPairs } from 'ramda'

import fs from 'fs'

import logger from './logger.js'

export function createFile(path, content) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content)
    logger.success(`[FILE] File ${path} created`)
  }
}

export function copyFile(fromPath, toPath, force) {
  if (!force && !!fs.existsSync(toPath)) {
    logger.warn(`[FILE] File already exists: ${toPath}`)
    return
  }
  fs.copyFileSync(fromPath, toPath)
  logger.success(`[FILE] File ${toPath} copied`)
}

export function copyFileAndReplaceVars(fromPath, toPath, vars) {
  if (!!fs.existsSync(toPath)) {
    logger.warn(`[FILE] File already exists: ${toPath}`)
    return
  }

  let content = fs.readFileSync(fromPath, 'utf8')

  content = toPairs(vars).reduce((content, [key, value]) => {
    return content.replaceAll(key, value)
  }, content)

  fs.writeFileSync(toPath, content)
  logger.success(`[FILE] File ${toPath} created`)
}

export function replaceOnFile(path, before, after, force) {
  if (!fs.existsSync(path)) {
    logger.error(`[FILE] File not found: ${path}`)
    return
  }

  const content = fs.readFileSync(path, 'utf-8')
  const index = content.indexOf(before)

  if (index < 0 || !after) {
    logger.warn(`[FILE] Index or content incorrect to insert on ${path}`)
    return
  }

  if (!force && content.includes(after)) {
    logger.warn(`[FILE] Content already on file ${path}`)
    return
  }

  const newContent = content.replace(before, after)

  fs.writeFileSync(path, newContent, 'utf-8')

  logger.success(`[FILE] File ${path} updated`)
}

export function insertOnFile(path, partial, rule, position = 'after') {
  partial = `${position === 'before' ? partial : ''}${rule}${position === 'after' ? partial : ''}`

  replaceOnFile(path, rule, partial)
}
