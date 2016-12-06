const webpack = require('webpack');
const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  output: {comments: false},
  compress: {warnings: false}
});

module.exports = {
  entry: './index.js',
  output: {filename: './dist/index.min.js'},
  plugins: [uglifyJsPlugin]
};