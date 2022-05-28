const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const htmlFileNames = fs.readdirSync(path.resolve(__dirname, './src/html'));

const getPlugins = () => {
  const plugins = [];
  htmlFileNames.forEach((filename) => {
    const splitted = filename.split('.');
    if (splitted[1] === 'html') {
      plugins.push(
        new HtmlWebpackPlugin({
          filename: `./${filename}`,
          template: `./src/html/${filename}`,
          inject: false
        })
      );
    }
  });
  return plugins;
};

module.exports = {
  mode: 'development',
  target: 'web',
  entry: ['./src/js/index.js', './src/scss/main.scss'],
  output: {
    filename: './js/bundle.js',
    assetModuleFilename: (pathData) => {
      return pathData.filename.replace('src/', '');
    },
    clean: true,
  },
  devServer: {
    hot: false,
    watchFiles: [path.resolve(__dirname, 'src/html/*.html')]
  },
  stats: {
    children: true,
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        loader: path.resolve(__dirname, './webpack/loader/html-loader.js'),
        options: {
          html: htmlFileNames
        }
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require.resolve('sass'),
            },
          },
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './main.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets',
          to: './assets',
        }
      ],
    }),
  ].concat(getPlugins()),
};
