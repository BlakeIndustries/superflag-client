const esbuild = require('esbuild');
const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');

function buildOneType(entryPoints, format, outFolder) {
  esbuild
    .build({
      plugins: [pnpPlugin()],
      entryPoints: entryPoints,
      bundle: true,
      outfile: [
        // 'build',
        outFolder || '',
        `index.${format === 'esm' ? 'mjs' : format}`,
      ]
        .filter((segment) => !!segment)
        .join('/'),
      format: format,
      external: [
        // peer deps
        'react',
        'react-dom',
      ],
    })
    .catch((err) => {
      console.error('esbuild error', err);
      process.exit(1);
    });
}

function buildBothTypes(entryPoints, outFolder) {
  buildOneType(entryPoints, 'esm', outFolder);
  buildOneType(entryPoints, 'cjs', outFolder);
}

function buildDefaultSources(sources) {
  sources.map((source) => {
    buildBothTypes(
      [`src/defaultSources/${source}/index.ts`],
      'defaultSources/' + source
    );
  });
}

// build commands
buildBothTypes(['src/index.ts']);

buildDefaultSources(['constant', 'webRequest', 'launchDarkly']);
