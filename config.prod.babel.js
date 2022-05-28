const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWepackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const htmlFileNames = fs.readdirSync(path.resolve(__dirname, './src/html'));

const getEntries = () => {
  const entries = [
    './src/js/index.js',
    './src/scss/main.scss'
  ];

  htmlFileNames.forEach((filename) => {
    entries.push(`./src/html/${filename}`);
  });
  return entries;
};

const getPlugins = () => {
  const plugins = [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['dist']
    }),
    new MiniCssExtractPlugin({
      filename: './assets/main.css',
    }),
    new CopyWepackPlugin({
      patterns: [
        {
          from: path.join(__dirname, './src/assets'),
          to: path.join(__dirname, './dist/assets')
        }
      ]
    })
  ];
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
  mode: 'production',
  target: 'web',
  entry: getEntries(),
  output: {
    filename: './assets/js/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: getPlugins(),
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
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require.resolve('sass'),
            },
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jpg', '.html', '.scss']
  }
};
