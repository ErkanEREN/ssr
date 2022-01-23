
const path = require('path')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../packages/client/package.json').dependencies;
const nodeExternals = require('webpack-node-externals')

const getConfig = env => {
  const production = env.production
  const development = !production
  return ({
    name: 'client-web',
    mode: development ? 'development' : 'production',
    devtool: 'source-map',
    target: 'web',
    entry: '../packages/client/main-web.js',
    module: {
      rules: [
        {
          test: /\.([jt])sx?$/,
          exclude: /.*(([\\/]node_modules[\\/])|\.yarn)/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              comments: true,
              presets: [
                // '@babel/preset-typescript',
                // '@babel/preset-react',
                [
                  "@babel/preset-react", {
                  }
                ],
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    useBuiltIns: 'entry',
                    corejs: 'core-js@3',
                  },
                ],
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                '@loadable/babel-plugin',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
          ],
        },
      ],
    },
    // externals: development? ['@loadable/component', nodeExternals(), '@workspace/common', "react", "react-dom"] : undefined,
    optimization: {
      // runtimeChunk: false,
      usedExports: true,
      // splitChunks: {
      //   chunks: 'async',
      //   minSize: 20000,
      //   minChunks: 1,
      //   maxAsyncRequests: 30,
      //   maxInitialRequests: 30,
      //   minSizeReduction: 200000,
      //   maxAsyncSize: 244000,
      //   enforceSizeThreshold: 150000,
      //   // cacheGroups: {
      //   //   defaultVendors: {
      //   //     name: 'defaultVendors',
      //   //     test: /.*(([\\/]node_modules[\\/])|\.yarn)/,
      //   //     priority: -10,
      //   //     reuseExistingChunk: true,
      //   //   },
      //   //   main: {
      //   //     name: 'main',
      //   //     test: /.*(([mM]+ain.*)|App)\.js/,
      //   //     priority: 5,
      //   //   }
      //   // },
      // }
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', 'jsx', '.css']
    },
    output: {
      path: path.join(__dirname, '..', 'build', 'public', 'web'),
      sourceMapFilename: development ? path.join('sourcemap','sourcemap-[name].js.map') : path.join('..', '..', 'sourcemap', 'web', 'sourcemap-[name].js.map'),
      filename: '[name]-bundle-[contenthash:8].js',
      clean: true,
      publicPath: '/public/web/'
    },
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
    },
    watch: development,
    plugins: [new LoadablePlugin()]
  })
}
module.exports = (env) => getConfig(env)