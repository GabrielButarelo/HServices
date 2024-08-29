import { ServiceDecorator } from '../src/decorators';
import Service from '../src/service';

@ServiceDecorator({
	name: 'service-teste',
	group: 'group-teste',
})
export default class MyService extends Service {
	constructor() {
		super();
	}

	async onStarted(): Promise<void> {
		console.log('Mensagem do onStarted do serviço teste');
	}

	async onStopped(): Promise<void> {
		console.log('Mensagem do onStoped do serviço teste');
	}
}
