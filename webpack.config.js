const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')



module.exports = env => {
  const isDev = env === 'development'
  const isDoc = env === 'documents'
  const config = {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, isDoc ? './docs/' : './dist/'),
      filename: isDev ? 'mo.effects.js' : 'mo.effects.[hash:7].js',
      publicPath: '',
      library: 'MoEffects',
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader'
          }],
          exclude: /node_modules/
        },
      ],
    },
    plugins: [],
  }

  if (isDoc || isDev) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: isDev ? 'index.html' : path.resolve(__dirname, './docs/index.html'),
        template: path.resolve(__dirname, './examples/index.html'),
        chunks: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          minifyCSS: true,
          minifyJS: true
        },
      })
    )
  }

  // 配置devserver
  if (isDev) {

    config.devtool = 'inline-source-map'
    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      host: '0.0.0.0',
      port: 9001,
      hot: true,
      open: true
    }
  }

  return config
}