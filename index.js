#!/usr/bin/env node

import { fileURLToPath } from 'url'
import path from 'path'

import main from './lib/main/index.js'

const __filename = fileURLToPath(import.meta.url)
const LIB_PATH = path.dirname(__filename)

main(LIB_PATH)
