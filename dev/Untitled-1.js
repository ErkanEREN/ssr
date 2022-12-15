(
    (context, filesystem, filename, options) => (
        new vm.Script(
            filesystem.readFileSync(context.__dirname+'/'+filename).toString()
        )
    ).runInNewContext(
        vm.createContext({
            ...context,
            Buffer: global.Buffer,
            process: global.process,
            // Buffer: global.Buffer,
            global: {
                Uint8Array: global.Uint8Array,
                // Uint8Array: global.Uint8Array
            }
        }),
        {
            dirname : ctx.__dirname,
            filename : ctx.__dirname + filename,
            ...options
        })
)(ctx, ctx.allfss.memfs,"dev.js")

// compiler.hooks.afterEmit.tap('domagic?', (compilation) => {
//     if(compilation && compilation.errors && compilation.errors[0]){
//         console.error(compilation.errors)
//         return compilation
//     }
//     const PrepScript = (context, filesystem, filename, options) => {
//         const code = filesystem.readFileSync(context.__dirname+'/'+filename).toString();
//         const script = new vm.Script(
//             code,
//             {
//                 dirname : context.__dirname,
//                 filename : context.__dirname + filename,
//                 ...options
//             }
//         );
//         const contextified = vm.createContext({
//             ...context,
//             Buffer: global.Buffer,
//             process: global.process,
//             global: {
//                 Uint8Array: global.Uint8Array,
//             },
//         });
//         const run = () => script.runInNewContext(contextified, options);
//         run.context  = contextified ;
//         run.filesystem = filesystem;
//         run.filename = filename;
//         run.options = options;
//         run.code = code;        // patchFs(mfs);
//         // patchRequire(mfs);       
//         return run
//         // return vm.runInContext(code, parsingContext, options)
//     }
//     const ss = PrepScript(ctx, ctx.allfss.memfs,"dev.js")
//     debugger
//     let ssr = ss()
// /*
//     const opt = {};
//     const run = (path, filename) => {
//         const content = memfs.readFileSync(path+'/'+filename);
//         const code = content.toString();
//         opt.dirname = '/workspaces/ssr/' //must be sync due to race condition ;/
//         opt.filename = '/workspaces/ssr/'+filename //must be sync due to race condition ;/
//         const script = new vm.Script(
//             code,
//             opt
//         );
//         // patchFs(mfs);
//         // patchRequire(mfs);       
//         return script.runInNewContext(vm.createContext({...ctx}),opt)
//         // return vm.runInContext(code, parsingContext, options)
//     }
//     run.context = ctx;
//     run.options = opt;
//     // let abcExec = run('build', 'dev.js');
//     // let aa = 6;
//     // someMagicShit(abc.app)
//     console.debug('at the enbd',{r:{...run}})
// //   compiler.close((closeErr) => {
// //     // ...
// //   });
// /**/
//  });


