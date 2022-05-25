const esbuild = require('esbuild');
const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');

esbuild
  .build({
    plugins: [pnpPlugin()],
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'build/index.js',
  })
  .catch((err) => {
    console.error('esbuild error', err);
    process.exit(1);
  });
