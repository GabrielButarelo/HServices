import Service from '../service';
import { Event } from '../decorators';

export default class TesteService extends Service {
	constructor() {
		super();
		this.name = 'teste';
		this.group = 'teste';
	}

	@Event({
		name: 'teste',
		group: 'oi',
	})
	sendMessage() {
		console.log('oi');
	}
}
