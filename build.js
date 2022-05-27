const esbuild = require('esbuild');
const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');

esbuild
  .build({
    plugins: [pnpPlugin()],
    entryPoints: [
      'src/index.ts',
      'src/defaultSources/constant/index.ts',
      'src/defaultSources/webRequest/index.ts',
      'src/defaultSources/launchDarkly/index.ts',
    ],
    bundle: true,
    outdir: 'build',
  })
  .catch((err) => {
    console.error('esbuild error', err);
    process.exit(1);
  });
