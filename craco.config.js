const { CracoAliasPlugin } = require('react-app-alias');

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {},
    },
  ],
  webpack: {
    configure: {
      // See https://github.com/webpack/webpack/issues/6725
      module: {
        rules: [
          {
            test: /\.wasm$/,
            type: 'javascript/auto',
          },
        ],
      },
    },
  },
};
