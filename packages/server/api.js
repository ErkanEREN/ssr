import { Router } from 'express';
// import path from 'path'
// import ssrRoute from './ssr-route';

const api = Router();

api.route("/hello").get((req, res) => {
    res.send({data: "world", r: {...req}})
})

// app.use('/public', express.static(path.join(__dirname, '../../build/public')))
// const port = process.env.PORT || 9000
// app.listen(port, () => console.log(`Server is running on port: ${port}`));

export default api