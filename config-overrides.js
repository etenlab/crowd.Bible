const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const { aliasWebpack, aliasJest } = require('react-app-alias');

function mainOverride(config, env) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    path: require.resolve('path-browserify'),
    fs: require.resolve('browserify-fs'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];

  config.ignoreWarnings = [/Failed to parse source map/];

  // inspired by https://github.com/typeorm/typeorm/issues/4526
  // to tackle bug with typerom entites metadata on finified calssnames,
  // we want to keep classnames not minified.

  const terserPluginIdx = config.optimization.minimizer.findIndex(
    (minimizer) => minimizer instanceof TerserPlugin,
  );
  config.optimization.minimizer[terserPluginIdx] = new TerserPlugin({
    extractComments: true,
    parallel: true,
    terserOptions: {
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
        inline: 2,
      },
      mangle: {
        safari10: true,
      },
      keep_classnames: true,
      keep_fnames: true,
    },
  });

  const workboxWebpackPluginIndex = config.plugins.findIndex(
    (plugin) => plugin instanceof WorkboxWebpackPlugin.GenerateSW,
  );

  // if (workboxWebpackPluginIndex !== -1) {
  //   config.plugins[
  //     workboxWebpackPluginIndex
  //   ].config.maximumFileSizeToCacheInBytes = 10 * 1024 * 1024; // 10MB
  // } else {
  //   const swPlugin = new WorkboxWebpackPlugin.InjectManifest({
  //     // These are some common options, and not all are required.
  //     // Consult the docs for more info.
  //     // exclude: [/.../, '...'],
  //     maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
  //     // swSrc: './src/service-worker.ts',
  //   })
  //   config.plugins.push(swPlugin)
  // }

  return config;
}

const options = {};

const pathAliasOverride = aliasWebpack(options);

module.exports = function override(config) {
  config = mainOverride(config);
  config = pathAliasOverride(config);
  return config;
};

module.exports.jest = aliasJest(options);
