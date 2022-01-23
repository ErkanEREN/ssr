const path = require('path')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../packages/server/package.json').dependencies;
const nodeExternals = require('webpack-node-externals')

module.exports = env => {
  const production = env.production
  const development = !production
  return {
    name: "server",
    mode: development ? 'development' : 'production',
    devtool: 'source-map',
    target: 'node',
    entry: {
      client: {
        import: path.join('..','packages','client','main-node.js'),
        filename: development?'[name]-bundle.js':'[name]-bundle-[contenthash:8].js' 
      },
      server: {
        import: path.join('..','packages','server','main.js'),
        filename: development?'[name]-bundle.js':'[name]-bundle-[contenthash:8].js' 
      }
    },
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
                [
                  "@babel/preset-react", {
                  }
                ],
                [
                  '@babel/preset-env',
                  {
                    targets: { node: 'current' },
                    modules: false
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
    // externals:development? ['@loadable/component', nodeExternals(), 'express', '@workspace/common'] : [nodeExternals()],
    optimization: {
      // usedExports: true,
      // minimize: false,
      // splitChunks: {
      //   // cacheGroups: {
      //   //   vendor: {
      //   //     test: /.*(([\\/]node_modules[\\/])|\.yarn)/,
      //   //     name: 'vendors',
      //   //     priority: -20,
      //   //     chunks: 'all'
      //   //   },
      //   //   main: {
      //   //     name: 'main',
      //   //     test: /.*(([mM]+ain.*)|App)\.js/,
      //   //     priority: 5,
      //   //   }
      //   // }
      // },
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', 'jsx', '.css'],
    },

    output: {
      path: path.resolve(__dirname, '..','build','server'),
      sourceMapFilename: '[name]-sourcemap-[contenthash:8].js.map',
      libraryTarget: 'commonjs2',
      clean: true
    },
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
    },
    watch: development,
    plugins: [new LoadablePlugin(),
    new ModuleFederationPlugin({
      name: 'Server',
      library: { type: 'commonjs-module' },
      filename: 'remoteEntry.js',
      exposes: {
        './Remote/Main': path.join('..','packages','client','main-node.js'),
        './Remote/App': path.join('..','packages','client','App.js'),
        './Remote/Theme': path.join('..','common','theme.js'),
        './Remote/Cache': path.join('..','common','createEmotionCache.js'),
      },
      remotes: {
        Server: path.join('..','..','build','server','remoteEntry.js'),
      },
      shared: {
        // ...deps,
        // 'express': { requiredVersion: deps['express'],eager: true, singleton: true },
        'react': { requiredVersion: deps['react'], singleton: true, eager:true },
        'react-dom': { requiredVersion: deps['react-dom'], singleton: true, eager:true },
        '@mui/material': { requiredVersion: deps['@mui/material'], singleton: true, eager:true },
        '@mui/icons': { requiredVersion: deps['@mui/icons'], singleton: true, eager:true },
        '@emotion/cache': { requiredVersion: deps['@emotion/cache'], singleton: true, eager:true },
        '@emotion/react': { requiredVersion: deps['@emotion/react'], singleton: true, eager:true },
        '@emotion/styled': { requiredVersion: deps['@emotion/styled'], singleton: true, eager:true },
        '@loadable/component': { requiredVersion: deps['@loadable/component'], singleton: true, eager:true },
      },
    })
    ]
  }
}