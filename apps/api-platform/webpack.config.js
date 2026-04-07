const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api-platform'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        './src/assets',
        {
          input: '../../packages/infra/prisma/prisma',
          glob: '**/*',
          output: './prisma',
        },
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      runtimeDependencies: ['@prisma/client', 'prisma'],
      sourceMap: true,
    }),
  ],
};
