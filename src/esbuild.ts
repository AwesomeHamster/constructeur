import { BuildOptions } from 'esbuild'
import { yamlPlugin } from 'esbuild-plugin-yaml'
import { readFileSync } from 'fs-extra'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export const config: BuildOptions = {
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node12',
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.bundle.js',
  external: [
    ...Object.keys({
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
      ...(pkg.peerDependencies ?? {}),
    }),
  ],
  minify: true,
  sourcemap: true,
  plugins: [yamlPlugin({})],
}

export const esmConfig: BuildOptions = {
  ...config,
  format: 'esm',
  outfile: 'dist/index.esm.mjs',
}
