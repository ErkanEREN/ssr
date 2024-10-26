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

globalThis.script.app = appHttp => {
    console.log('prem mid',appHttp)

    appHttp.use('/apai/*', api)

    appHttp.get('/', (req, res) => {
              res.send('Hello World!')
    })
    appHttp.get('/jeaa', (req, res) => {
        res.send('jello World!')
    })
    console.log('post mid',appHttp)
    return ({
        appHttp,
        routes: { api }
    })
}
