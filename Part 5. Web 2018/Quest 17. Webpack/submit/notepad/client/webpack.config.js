const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = {
  entry: ['@babel/polyfill', './src/main.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node-modules/
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  devtool: '#eval-source-map',
  plugins: [
    new VueLoaderPlugin()
  ]
}
module.exports = (env, argv) => {
  
  if(argv.mode ==='production'){
    config.devtool = 'source-map'
  }
  return config;
}

// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = '#source-map'
//   // http://vue-loader.vuejs.org/en/workflow/production.html
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     // new webpack.optimize.UglifyJsPlugin({
//     //   sourceMap: true,
//     //   compress: {
//     //     warnings: false
//     //   }
//     // }),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ])
// }


// webpack4
// css loader
// var MiniCssExtractPlugin = require('mini-css-extract-plugin')

// module.exports = {
//   // other options...
//   module: {
//     rules: [
//       // ... other rules omitted
//       {
//         test: /\.css$/,
//         use: [
//           process.env.NODE_ENV !== 'production'
//             ? 'vue-style-loader'
//             : MiniCssExtractPlugin.loader,
//           'css-loader'
//         ]
//       }
//     ]
//   },
//   plugins: [
//     // ... Vue Loader plugin omitted
//     new MiniCssExtractPlugin({
//       filename: 'style.css'
//     })
//   ]
// }