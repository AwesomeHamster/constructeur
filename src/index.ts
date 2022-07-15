#!/usr/bin/env node

import path from 'path'
import yaml from 'js-yaml'
import build from './build'
import { readFile } from 'fs-extra'

const args = process.argv.slice(2)
const [action, ...rest] = args

;(async () => {
  if (action === 'build') {
    build(await readConfig(rest))
  }
})()

export async function readConfig(configs: string[]): Promise<any[]> {
  return await Promise.all(
    configs.map(async (config) => {
      const extname = path.extname(config)
      if (extname === '.yaml' || extname === '.yml') {
        return yaml.load(await readFile(config, 'utf8'))
      } else if (extname === '.json') {
        return JSON.parse(await readFile(config, 'utf8'))
      } else {
        return require(config)
      }
    }),
  )
}
