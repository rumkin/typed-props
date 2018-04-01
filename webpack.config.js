const webpack = require('webpack');

const name = 'typed-props';
const exportVar = 'TypedProps';

const DEV = process.env.NODE_ENV !== 'production';
const filename = DEV ? `${name}.js` : `${name}.min.js`;

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    filename,
    library: exportVar,
  },
  module: {
    loaders: [
        {
          test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
            },
        },
    ],
  },
  plugins: DEV ? [] : [
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
