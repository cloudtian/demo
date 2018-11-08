const path = require('path');

// 如果修改了入口起点的名称或添加新的名称，生成的包将被重命名在一个构建中，但是index.html文件仍然会引用旧的名字
// HtmlWebpackPlugin 会默认生成index.html文件替换已有的
const HtmlWebpackPlugin = require('html-webpack-plugin');

// build前先清理dist文件夹，然后再生成新的
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 用于跟踪模块映射到输出bundle的过程
const WebpackManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },

  // 用于开发环境中定位报错的源文件，而不是构建之后的文件
  devtool: 'inline-source-map',

  // 使用webpack-dev-server
  devServer: {
    contentBase: './dist'
  },

  plugins: [
    new WebpackManifestPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
}