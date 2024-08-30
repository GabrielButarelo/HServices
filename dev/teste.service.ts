import { CronJob } from 'cron';
import Broker from '../src/broker';
import { Event, ServiceDecorator } from '../src/decorators';
import Service from '../src/service';

@ServiceDecorator({
	name: 'service-teste',
	group: 'group-teste',
})
export default class MyService extends Service {
	constructor(broker: Broker) {
		super(broker);
	}

	async onStarted(): Promise<void> {
		new CronJob('*/10 * * * * *', async () => {
			try {
				this.broker.emit('create', 'teste');
			} catch {
				new Error('Cron not run');
			}
		}).start();
	}
}
