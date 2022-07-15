import esbuild, { BuildOptions } from 'esbuild'
import {
  config as defaultConfig,
  esmConfig as defaultEsmConfig,
} from './esbuild'

type Options = BuildOptions & { hybrid?: boolean }

export default async function build(
  config?: Options | Options[],
): Promise<void> {
  if (!config) {
    config = [defaultConfig]
    if (config[0].hybrid) {
      config.push(defaultEsmConfig)
    }
  }
  if (!Array.isArray(config)) {
    config = [config]
  }
  await Promise.all(config.map((c) => esbuild.build(c)))
}
