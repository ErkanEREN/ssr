

import api from './api';

api.forEach(element => {
	globalThis.app[element.method](element.route, element.handle);
});
