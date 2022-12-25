// const { application } = require('express');
// const express = require('express')
// const app = express()
// const port = 9000

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

// module.exports = (
//     (
//         app=(require('express')()),
//         deps=['Server/Api', 'Server/ServerRenderer']
//     )=>
//         deps.reduce((_, dep)=>app.use(require(dep))
//     )
// );

import api from './api';
debugger
globalThis.script.app = appHttp => {
    debugger
    console.debug('prem mid',appHttp.routes)

    appHttp.use('/api/*', api)

    appHttp.get('/', (req, res) => {
        debugger
        res.send('Hello World!')
    })
    appHttp.get('/j', (req, res) => {
        res.send('jello World!')
    })
    console.debug('post mid',appHttp.routes)
    return ({
        appHttp,
        routes: { api }
    })
}
