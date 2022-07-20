import esbuild, { BuildOptions } from 'esbuild'
import {
  config as defaultConfig,
} from './esbuild'

type Options = BuildOptions & { hybrid?: boolean }

export default async function build(
  config?: Options | Options[],
  override?: Options,
): Promise<void> {
  if (!config || (Array.isArray(config) && config.length === 0)) {
    config = [defaultConfig]
  }
  if (!Array.isArray(config)) {
    config = [config]
  }
  await Promise.all(
    config.map((c) => esbuild.build({ ...c, ...(override ?? {}) })),
  )
}
