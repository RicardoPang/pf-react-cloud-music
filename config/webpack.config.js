module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  return {
    devtool: isEnvDevelopment ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              sourceMaps: isEnvDevelopment,
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isEnvDevelopment,
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
      ],
    },

    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        exclude: ['vendor.js'],
      }),
    ],
  };
};
