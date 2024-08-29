import { EventEmitter } from 'events';
import 'reflect-metadata';

export default abstract class Service extends EventEmitter {
	public name: string;
	public group: string;
	public events: any;

	constructor() {
		super();
		this.events = {};
		this.initialize();
	}

	private initialize() {
		const serviceConfig = Reflect.getMetadata('serviceConfig', this.constructor);
		if (serviceConfig) {
			this.name = serviceConfig.name;
			this.group = serviceConfig.group;
		} else {
			throw new Error('Service metadata not found');
		}
	}

	public async start() {
		// await this.beforeStart();
		this.emit('started', { name: this.name, group: this.group });
		await this.onStarted();
	}

	public async stop() {
		// await this.beforeStop();
		this.emit('stopped', { name: this.name, group: this.group });
		await this.onStopped();
	}

	// protected async beforeStart() {}

	protected async onStarted() {}

	// protected async beforeStop() {}

	protected async onStopped() {}
}
