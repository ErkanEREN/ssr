// import { Router } from 'express';
// import path from 'path'
// import ssrRoute from './ssr-route';

const api = [
	{
			method: 'get',
			route: '/',
			handle: (req, res) => {
					res.send({data: "hello world"})
			}
	},
	{
			method: 'get',
			route: '/j',
			handle: (req, res) => {
					res.send({data: "jello world"})
			}
	},
	{
			method: 'get',
			route: '/k',
			handle: (req, res) => {
					res.send({data: "kello world"})
			}
	}
]

// app.use('/public', express.static(path.join(__dirname, '../../build/public')))
// const port = process.env.PORT || 9000
// app.listen(port, () => console.log(`Server is running on port: ${port}`));

export default api
