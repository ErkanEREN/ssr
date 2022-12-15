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

import api from '@tomi/server/api';

globalThis.app = appHttp => {
    console.debug('prem mid',appHttp.routes)

    appHttp.use('/api/*', api)

    appHttp.get('/', (req, res) => {
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