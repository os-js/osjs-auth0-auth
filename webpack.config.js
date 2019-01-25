const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const minimize = mode === 'production';

module.exports = {
  mode,
  devtool: 'source-map',
  entry: [
    path.resolve(__dirname, 'client.js'),
  ],
  output: {
    library: 'osjsAuth0AuthAdapter',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    sourceMapFilename: '[file].map',
    filename: '[name].js'
  },
  optimization: {
    minimize,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)\/(?!@osjs)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
