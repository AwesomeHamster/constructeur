import { readFile } from 'fs-extra'
import { resolve } from 'path'

import { CAC } from 'cac'
import esbuild, { BuildOptions } from 'esbuild'
import yaml from 'js-yaml'

const yamlPlugin = (options: yaml.LoadOptions = {}): esbuild.Plugin => ({
  name: 'yaml',
  setup(build) {
    build.onResolve({ filter: /\.ya?ml$/ }, ({ path, resolveDir }) => {
      if (resolveDir === '') return
      return {
        path: resolve(resolveDir, path),
        namespace: 'yaml',
      }
    })

    build.onLoad({ namespace: 'yaml', filter: /.*/ }, async ({ path }) => {
      const source = await readFile(path, 'utf8')
      return {
        loader: 'json',
        contents: JSON.stringify(yaml.load(source, options)),
      }
    })
  },
})

export function apply(cac: CAC): CAC {
  cac
    .command('build [config]')
    .option('minify', 'minify the bundle', { default: true })
    .option('hybrid', 'build both esm and cjs', { default: false })
    .action(async (config, options) => {
      const pkg = JSON.parse(await readFile('./package.json', 'utf-8'))
      let entry = ['src/index.ts']
      let output = 'dist/index.bundle.js'

      if (config) {
        const c = require(config)
        entry = c.entry ?? entry
        output = c.outfile ?? output
      }
      const buildOption: BuildOptions = {
        bundle: true,
        platform: 'node',
        target: 'node12',
        entryPoints: entry,
        outfile: output,
        external: [
          ...Object.keys({
            ...(pkg.dependencies ?? {}),
            ...(pkg.devDependencies ?? {}),
            ...(pkg.peerDependencies ?? {}),
          }),
        ],
        minify: options.minify,
        sourcemap: true,
        plugins: [yamlPlugin()],
      }
      esbuild.build({
        ...buildOption,
        format: 'cjs',
      })

      if (options.hybrid) {
        esbuild.build({
          ...buildOption,
          format: 'esm',
          outfile: 'dist/index.esm.mjs',
        })
      }
    })

  return cac
}
