import express from 'express'
import path from 'path'
import ssrRoute from './ssr-route';

const app = express()
app.use('/public', express.static(path.join(__dirname, '../../build/public')))
app.use(ssrRoute)
const port = process.env.PORT || 9000
app.listen(port, () => console.log(`Server is running on port: ${port}`));