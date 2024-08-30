import { glob } from 'glob';
import path from 'path';
import Logger from './logger';
import Service from './service';
import EventEmitter from 'events';

type ServiceConstructor = new (...args: any[]) => Service;

export default class Broker {
	private services: Map<string, Service> = new Map();
	private eventEmitter: EventEmitter;
	public logger: Logger;

	constructor() {
		this.eventEmitter = new EventEmitter();
		this.setupShutdown();
	}

	private registerService(name: string, serviceClass: ServiceConstructor) {
		const service = new serviceClass(this);
		this.services.set(name, service);

		service.on('started', info => {
			this.registerEvents(service);
			this.logger.info('BROKER', `Service ${info.name} for group ${info.group} started`);
		});

		service.on('stopped', info => {
			this.logger.info('BROKER', `Service ${info.name} for group ${info.group} stopped`);
		});
	}

	private registerEvents(service: Service) {
		const prototype = Object.getPrototypeOf(service);

		Object.getOwnPropertyNames(prototype).forEach(methodName => {
			const method = prototype[methodName];
			const eventConfig = Reflect.getMetadata('eventConfig', service, methodName);

			if (eventConfig) {
				const { name, group } = eventConfig;

				this.logger.info('BROKER', `Registry event name ${name} for group ${group}`);

				this.eventEmitter.on(name, method.bind(service));
			}
		});
	}

	emit(eventName: string, payload: any) {
		this.eventEmitter.emit(eventName, payload);
	}

	async startAllServices() {
		const startPromises: Promise<void>[] = [];

		this.services.forEach(service => {
			startPromises.push(service.start());
		});

		await Promise.all(startPromises);
	}

	private async stopAllServices() {
		const stopPromises: Promise<void>[] = [];

		this.services.forEach(service => {
			stopPromises.push(service.stop());
		});

		await Promise.all(stopPromises);
	}

	async loadServices(rootDir: string, mask: string) {
		const files = this.findServiceFiles(rootDir, mask);

		for (const file of files) {
			const modulePath = path.resolve(file);
			const module = await import(modulePath);

			for (const key in module) {
				const target = module[key];

				if (typeof target === 'function') {
					const serviceConfig = Reflect.getMetadata('serviceConfig', target);
					if (serviceConfig) {
						const { name } = serviceConfig;
						this.registerService(name, target);
					}
				}
			}
		}
	}

	private findServiceFiles(rootDir: string, mask: string): string[] {
		const pattern = path.resolve(process.cwd(), rootDir, mask);
		return glob.sync(pattern.replace(/\\/g, '/'), { absolute: true });
	}

	private setupShutdown() {
		process.on('SIGINT', () => this.shutdown());
		process.on('SIGTERM', () => this.shutdown());
		process.on('exit', () => this.shutdown());
	}

	private async shutdown() {
		this.logger.info('BROKER', 'Stopping broker');
		await this.stopAllServices();
		this.logger.info('BROKER', 'Stopped broker');
		process.exit(0);
	}
}
