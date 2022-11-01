// const path = require('path')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../packages/server/package.json').dependencies;
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const configGen = (
    { name, target, entry, babel, ignoreWarnings, output, plugins }) =>
({
    name,
    target,
    entry,
    mode: 'development',
    devtool: 'source-map',
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
                                    ...babel.presetEnv
                                },
                            ],
                        ],
                        plugins: [
                            ...babel.plugins,
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
    optimization: {
        usedExports: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
                    minSize: 0
                }
            }
        },
        chunkIds: "deterministic"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'jsx', '.css']
    },
    ignoreWarnings: ignoreWarnings,
    output: {
        ...output
    },
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
    },
    watch: true,
    plugins: [
        ...plugins,
        new LoadablePlugin()
    ]
});

const server = configGen({
    name: 'server',
    target: 'node',
    // entry: () => new Promise((resolve) => resolve(['View/view.js', 'Server/serverRoutes.js'])),
    entry: [
        // Runtime code for hot module replacement
        'webpack/hot/dev-server.js',
        // Dev server client for web socket transport, hot and live reload logic
        'webpack-dev-server/client/index.js?hot=true&live-reload=true',
        // Your entry
        'webpack/container/Server'
    ],
    // entry: {
    //     main: 'main/main.js'
    // },
    babel: {
        presetEnv: {
            targets: { node: 'current' },
            modules: false
        },
        plugins: [],
    },
    ignoreWarnings: [
        {
            //bundle express but do not show the warning
            module: /.*express\/lib\/view\.js.*/,
            message: /Critical dependency: the request of a dependency is an expression/,
        },
    ],
    plugins: [
        new ModuleFederationPlugin({
            name: 'main',
            library: { type: 'commonjs-module' },
            filename: 'main.js',
            remotes: {
                View: '../common/build/server/federated/view.js',
                Server: '../common/build/server/federated/serverRoutes.js',
            },
        }),
        new ModuleFederationPlugin({
            name: 'Server',
            library: { type: 'commonjs-module' },
            filename: 'federated/serverRoutes.js',
            exposes: {
                '../Api':
                    '../packages/server/api.js',

                '../ServerRenderer':
                    '../packages/server/ssr.js',
            },
            remotes: {
                View: '../common/build/server/federated/view.js',
            },
            shared: {
                'react': { requiredVersion: deps['react'], singleton: true},
                'react-dom': { requiredVersion: deps['react-dom'], singleton: true},
                '@mui/material': { requiredVersion: deps['@mui/material'], singleton: true},
                '@mui/icons': { requiredVersion: deps['@mui/icons'], singleton: true},
                '@emotion/cache': { requiredVersion: deps['@emotion/cache'], singleton: true},
                '@emotion/react': { requiredVersion: deps['@emotion/react'], singleton: true},
                '@emotion/styled': { requiredVersion: deps['@emotion/styled'], singleton: true},
                '@loadable/component': { requiredVersion: deps['@loadable/component'], singleton: true},
            },
        }), 
        new ModuleFederationPlugin({
            name: 'View',
            library: { type: 'commonjs-module' },
            filename: 'federated/view.js',
            exposes: {
                '../App':
                    '../packages/client/App.js',

                '../Theme':
                    '../common/theme.js',

                '../Cache':
                    '../common/createEmotionCache.js',
            },
            // remotes: {
            //     Server: '../common/build/server/federated/view.js',
            // },
            shared: {
                'react': { requiredVersion: deps['react'], singleton: true},
                'react-dom': { requiredVersion: deps['react-dom'], singleton: true},
                '@mui/material': { requiredVersion: deps['@mui/material'], singleton: true},
                '@mui/icons': { requiredVersion: deps['@mui/icons'], singleton: true},
                '@emotion/cache': { requiredVersion: deps['@emotion/cache'], singleton: true},
                '@emotion/react': { requiredVersion: deps['@emotion/react'], singleton: true},
                '@emotion/styled': { requiredVersion: deps['@emotion/styled'], singleton: true},
                '@loadable/component': { requiredVersion: deps['@loadable/component'], singleton: true},
            },
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new HtmlWebpackPlugin({
        //   title: 'Hot Module Replacement',
        // }),
    ],
    output: {
        path: __dirname+'/build',
        filename: "[name].js",
        chunkFilename: "[name].js",
        publicPath: "./build/public"
    }
})

module.exports = server

const compiler = webpack(server);

// `hot` and `client` options are disabled because we added them manually
const devServer = new webpackDevServer({ hot: false, client: false }, compiler);

(async () => {
  await devServer.start();
  console.log('dev devServer is running');
})();