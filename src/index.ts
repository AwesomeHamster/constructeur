#!/usr/bin/env node

import path from 'path'
import yaml from 'js-yaml'
import build from './build'
import { readFile } from 'fs-extra'
export * from './esbuild'

const args = process.argv.slice(2)
const [action, ...rest] = args

;(async () => {
  if (typeof action === 'undefined' || action === 'build') {
    build(await readConfig(rest))
  } else if (action === 'dev') {
    build(await readConfig(rest), { minify: false })
  } else {
    console.error(`Unknown action: ${action}`)
    process.exit(1)
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
        return require(path.resolve(config))
      }
    }),
  )
}
