
import api from "@tomi/server/api";

api.forEach(element => {
	globalThis.app[element.method](element.route, element.handle);
});
