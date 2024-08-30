import Broker from '../src/broker';
import { Event, ServiceDecorator } from '../src/decorators';
import Service from '../src/service';
import { CronJob } from 'cron';

@ServiceDecorator({
	name: 'user',
	group: 'user',
})
export default class UserService extends Service {
	constructor(broker: Broker) {
		super(broker);
	}

	@Event({ name: 'create', group: 'user' })
	handleCreateEvent(payload: any) {
		console.log('Event received:', payload);
	}
}
