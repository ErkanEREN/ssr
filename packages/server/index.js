const express = require('express')
const Api = require('Server/Api');
const ServerRenderer = require('Server/ServerRenderer');

const app = express()
const port = 9000


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




app.use(Api);
app.use(ServerRenderer);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
