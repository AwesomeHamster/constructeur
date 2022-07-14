import { CAC } from 'cac'
import esbuild from 'esbuild'
import { config, esmConfig } from './esbuild'

export function apply(cac: CAC): CAC {
  cac
    .command('build')
    .option('hybrid', 'build both esm and cjs', { default: false })
    .action(async (options) => {
      await esbuild.build(config)

      if (options.hybrid) {
        await esbuild.build(esmConfig)
      }
    })

  return cac
}
