const path = require('path');

module.exports = {
  entry: './src/front/index.ts',
  // devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /env\.ts$/,
        loader: 'string-replace-loader',
        options: {
          search: `(.*[Pp]assword.*)(\s*:[ \t]*['"])([^'"]*)(['"])`,
          replace: `$1$2***HIDDEN***$4`,
          flags: 'i'
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'web'),
  },
};
