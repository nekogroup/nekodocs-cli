import { toPairs } from 'ramda'
import chalk from 'chalk'

import fs from 'fs'
import path from 'path'

import { copyFile, copyFileAndReplaceVars } from './files.js'
import logger from './logger.js'

export function createFolderPath(path) {
  if (!!fs.existsSync(path)) {
    console.log(chalk.yellow(`[FOLDER] Folder ${path} already exists`))
    return
  }

  const fullPath = path.split('/').reduce((acc, folder) => {
    const fullPath = acc + folder + '/'
    createFolder(fullPath)
    return fullPath
  }, '')

  console.log(chalk.green(`[FOLDER] Folder ${path} created`))
}

export function createFolder(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export function copyFolder(fromPath, toPath, force) {
  if (!force && !!fs.existsSync(toPath)) {
    logger.warn(`[FOLDER] Folder already exists: ${toPath}`)
    return
  }

  const files = fs.readdirSync(fromPath)

  files.forEach((file) => {
    if (file.endsWith('.swp') || file === '.DS_Store') return
    const sourcePath = path.join(fromPath, file)
    const targetPath = path.join(toPath, file)

    if (fs.lstatSync(sourcePath).isDirectory()) {
      createFolderPath(targetPath)
      copyFolder(sourcePath, targetPath, force)
    } else {
      copyFile(sourcePath, targetPath)
    }
  })
}

export function copyFolderAndReplaceVars(fromPath, toPath, vars, force) {
  if (!force && !!fs.existsSync(toPath)) {
    logger.warn(`[FOLDER] Folder already exists: ${toPath}`)
    return
  }
  createFolderPath(toPath)

  const files = fs.readdirSync(fromPath)

  files.forEach((file) => {
    if (file.endsWith('.swp') || file === '.DS_Store') return
    const sourcePath = path.join(fromPath, file)

    const toFileName = toPairs(vars).reduce((file, [key, value]) => {
      return file.replaceAll(key, value)
    }, file)
    const targetPath = path.join(toPath, toFileName)

    if (fs.lstatSync(sourcePath).isDirectory()) {
      createFolderPath(targetPath)
      copyFolderAndReplaceVars(sourcePath, targetPath, vars, force)
    } else {
      copyFileAndReplaceVars(sourcePath, targetPath, vars)
    }
  })
}
