import { CAC } from 'cac'
import esbuild from 'esbuild'
import { config, esmConfig } from './esbuild-config'

export function apply(cac: CAC): CAC {
  cac
    .command('build [config]')
    .option('minify', 'minify the bundle', { default: true })
    .option('hybrid', 'build both esm and cjs', { default: false })
    .action(async (options) => {
      esbuild.build(config)

      if (options.hybrid) {
        esbuild.build(esmConfig)
      }
    })

  return cac
}
