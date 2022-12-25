
const base = (name, { target, entry, babel, ignoreWarnings = [], output, plugins = [], resolve }) => {
	const LoadablePlugin = require("@loadable/webpack-plugin")
	const MiniCssExtractPlugin = require("mini-css-extract-plugin")
	babel.presets	= babel.presets||[];
	return webpack.config.getNormalizedWebpackOptions({
		name,
		target,
		entry,
		context: "/workspaces/ssr/",
		mode: "development",
		devtool: "inline-source-map",
		module: {
			rules: [
				{
					test: /\.([jt])sx?$/,
					exclude: /.*(([\\/]node_modules[\\/])|\.yarn)/,
					use: {
						loader: "babel-loader",
						options: {
							babelrc: false,
							comments: true,
							presets: [
								...babel.presets,
								[
									"@babel/preset-typescript",
									{
										isTSX: true,
										allExtensions: true
									}
								],
								[
									"@babel/preset-env",
									{
										...babel.presetEnv
									},
								],
							],
							plugins: [
								...babel.plugins,
								"@babel/plugin-proposal-class-properties",
								"@babel/plugin-syntax-dynamic-import",
								"@loadable/babel-plugin",
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
						"css-loader",
					],
				},
			],
		},
		optimization: {
			splitChunks: {
				chunks: "all",
			},
			usedExports: true,
			// splitChunks: {
			//     cacheGroups: {
			//         commons: {
			//             name: "commons",
			//             chunks: "initial",
			//             minChunks: 1,
			//             minSize: 0
			//         }
			//     }
			// },
			chunkIds: "deterministic"
		},
		resolve: {
			...resolve,
			extensions: [".tsx", ".ts", ".js", "jsx", ".css"],
		},
		ignoreWarnings: [...ignoreWarnings],
		output: {
			...output
		},
		watch: true,
		watchOptions: {
			aggregateTimeout: 200,
			poll: 1000,
			stdin: true,
		},
		plugins: [
			...plugins,
			new LoadablePlugin()
		]
	})
}



// const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
// const deps = require("../packages/server/package.json").dependencies;
const webpack = require("webpack");

//look to deprecate fs bs
const { fs: memfs } = require("memfs");
const fs = require("fs");
const { ufs } = require("unionfs");
const { patchFs, patchRequire } = require("fs-monkey");
ufs
	.use(memfs)
	.use({ ...fs });
patchFs(ufs);
patchRequire(ufs);

const scriptRunner = (
	(
		(filename, cachedData) => {

			const prepareScript = async () => {
				const options = {
					displayErrors: true,
					filename: "packages/" + filename,
					cachedData
				}
				const vm = require("node:vm");
				const contents = memfs.readFileSync("/workspaces/ssr/dist/" + filename);
				const script = new vm.Script(
					contents.toString(),
					{
						...options
					}
				);
				const context = {
					["script"]: script,
					// filename: "/workspaces/ssr/packages/"+ filename,
					// __dirname: "/workspaces/ssr/packages/",
					// filename: "/packages/"+ filename
					// filename: "/workspaces/ssr/packages/" + filename,
				}
				const contextified = vm.createContext(context);
				options.cachedData = script.cachedData = script.createCachedData();
				const run = () => {
					run["returned"] = script.runInContext(contextified, {
						...options,
						displayErrors: true,
						filename: options.filename.replace("dist", "packages"),
						// timeout: 9000,
						breakOnSigint: true,
					});
					return run;
				};
				run["script"] = script;
				return run;
			}
			const printErr = (err) => {
				console.error(err.stack || err);
					if (err.details) {
						console.error(err.details);
					}
			}
			return (async (err, stats) => {
				if (err) {
					printErr(err)
					return;
				}
				if (stats.hasErrors()) {
					const errs = stats.stats.filter(stat=>stat.hasErrors()).reduce((acc,cur)=>[...acc, ...(cur.compilation.getErrors())],[]);
					errs.forEach(printErr);
					return;
					// ...
				}

				const iRan = (await prepareScript())();
				iRan.script.app({
					use: (a, b) => console.debug("appuse [a:", a, "||b:", b),
					get: (a, b) => console.debug("appget [a:", a, "||b:", b)
				}
				)
				// const exportedMaginc = runabbleScript.global.magic
				// exportedMaginc({
				//     use: (a, b) => console.debug("appuse [a:", a, "||b:", b),
				//     get: (a, b) => console.debug("appget [a:", a, "||b:", b)
				// })
			})
		}
	)
		("server/main.js")
)

const wpObj = ((entryDir, dstDir) => ({
	config: [
		base("server", {
			target: "node",
			// mode: "development",
			entry: entryDir + "/server/main.ts",
			// entry: [
			//     "../packages/server/main.js"
			// ],
			// entry: "../packages/server/dev.js",
			// entry: () => new Promise((resolve) => resolve(["View/view.js", "Server/serverRoutes.js"])),
			// entry: () => new Promise((resolve) => resolve(import("webpack/container/entry/remote@server"))),
			// entry: {
			//     Runtime code for hot module replacement
			//     // Dev server client for web socket transport, hot and live reload logic
			//     "webpack-dev-server/server/dev.js?hot=true&live-reload=true",
			// },
			babel: {
				presetEnv: {
					targets: { node: "current" },
					modules: false,
					useBuiltIns: "usage",
					corejs: { version: "3.8", proposals: true },
				},
				plugins: [],
			},
			resolve: {
				// alias: {
				//     ["node:fs"]: "memfs"
				// }
			},
			ignoreWarnings: [
				{
					//bundle express but do not show the warning
					module: /.*express\/lib\/view\.js.*/,
					message: /Critical dependency: the request of a dependency is an expression/,
				},
			],
			plugins: [
				// new ModuleFederationPlugin({
				//     name: "main",
				//     library: { type: "commonjs-module" },
				//     filename: "main.js",
				//     remotes: {
				//         "remote@server": "http://localhost:9000/federated/serverRoutes.js",
				//     },
				// }),
				// new ModuleFederationPlugin({
				//     name: "remote@server",
				//     library: { type: "commonjs-module" },
				//     filename: "federated/serverRoutes.js",
				//     exposes: {
				//         "./Api":
				//             "../packages/server/api.js",

				//         "./ServerRenderer":
				//             "../packages/server/serverRenderer.js",
				//     },
				//     remotes: {
				//         "remote@view": "http://localhost:9000/federated/view.js",
				//     },
				//     shared: {
				//         "react": { requiredVersion: deps["react"], singleton: true},
				//         "react-dom": { requiredVersion: deps["react-dom"], singleton: true},
				//         "@mui/material": { requiredVersion: deps["@mui/material"], singleton: true},
				//         "@mui/icons": { requiredVersion: deps["@mui/icons"], singleton: true},
				//         "@emotion/cache": { requiredVersion: deps["@emotion/cache"], singleton: true},
				//         "@emotion/react": { requiredVersion: deps["@emotion/react"], singleton: true},
				//         "@emotion/styled": { requiredVersion: deps["@emotion/styled"], singleton: true},
				//         "@loadable/component": { requiredVersion: deps["@loadable/component"], singleton: true},
				//     },
				// }),
				// new ModuleFederationPlugin({
				//     name: "remote@view",
				//     library: { type: "commonjs-module" },
				//     filename: "federated/view.js",
				//     exposes: {
				//         "./App":
				//             "../packages/client/App.js",

				//         "./Theme":
				//             "../common/theme.js",

				//         "./Cache":
				//             "../common/createEmotionCache.js",
				//     },
				//     // remotes: {
				//     //     view: "http://localhost:9000/federated/view.js",
				//     // },

				//     shared: {
				//         "react": { requiredVersion: deps["react"], singleton: true},
				//         "react-dom": { requiredVersion: deps["react-dom"], singleton: true},
				//         "@mui/material": { requiredVersion: deps["@mui/material"], singleton: true},
				//         "@mui/icons": { requiredVersion: deps["@mui/icons"], singleton: true},
				//         "@emotion/cache": { requiredVersion: deps["@emotion/cache"], singleton: true},
				//         "@emotion/react": { requiredVersion: deps["@emotion/react"], singleton: true},
				//         "@emotion/styled": { requiredVersion: deps["@emotion/styled"], singleton: true},
				//         "@loadable/component": { requiredVersion: deps["@loadable/component"], singleton: true},
				//     },
				// }),
				// new webpack.HotModuleReplacementPlugin(),
				// new HtmlWebpackPlugin({
				//   title: "Hot Module Replacement",
				// }),
			],
			output: {

				path: dstDir,
				filename: "./server/[name].js",
				chunkFilename: "./server/[name]-bundle.js",
				publicPath: dstDir + "/public"
			},
		}),
		base("client-web", {
			target: "web",
			// mode: "development",
			entry: entryDir + "/client/main-web.ts",
			babel: {
				presetEnv: {
					modules: false,
					// useBuiltIns: "entry", //this is actual client build wanna try other
					useBuiltIns: "usage",
					targets: [">0.2%", "not dead", "not op_mini all"],
					corejs: { version: "3.8", proposals: true },
				},
				plugins: [
					[/*here*/
						"babel-plugin-import",
						{
							libraryName: "@mui/material",
							libraryDirectory: "",
							camel2DashComponentName: false,
						},
						"core",
					],
					[/*here*/
						"babel-plugin-import",
						{
							libraryName: "@mui/icons-material",
							libraryDirectory: "",
							camel2DashComponentName: false,
						},
						"icons",
					],
				],
				presets: [
					[
						"@babel/preset-react", {

						}
					],
				]
			},
			resolve: {
				alias: {
					// fs: "memfs"
				}
			},
			output: {
				path: dstDir,
				filename: "./public/client/web/[name].js",
				chunkFilename: "./public/client/web/[name]-bundle.js",
				publicPath: dstDir + "/public"
			},
		}),
	],
	callback: scriptRunner,
}))(
	"/workspaces/ssr/packages",
	"/workspaces/ssr/dist",
)


// module.exports = wpObj.config
// /*

const compiler = webpack(
	wpObj.config, wpObj.callback
);
compiler.outputFileSystem = memfs

/**/
