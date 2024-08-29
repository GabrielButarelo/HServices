import { glob } from 'glob';
import path from 'path';
import Logger from './logger';
import Service from './service';

type ServiceConstructor = new (...args: any[]) => Service;

export default class Broker {
	private services: Map<string, Service> = new Map();
	public logger: Logger;

	constructor() {
		this.setupGracefulShutdown();
	}

	public registerService(name: string, serviceClass: ServiceConstructor) {
		const service = new serviceClass();
		this.services.set(name, service);

		service.on('started', info => {
			this.logger.info(`Service ${info.name} for group ${info.group} started`);
		});

		service.on('stopped', info => {
			this.logger.info(`Service ${info.name} for group ${info.group} stopped`);
		});
	}

	public async startAllServices() {
		const startPromises: Promise<void>[] = [];

		this.services.forEach(service => {
			startPromises.push(service.start());
		});

		await Promise.all(startPromises);
	}

	public async stopAllServices() {
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

	findServiceFiles(rootDir: string, mask: string): string[] {
		const pattern = path.resolve(process.cwd(), rootDir, mask);
		return glob.sync(pattern.replace(/\\/g, '/'), { absolute: true });
	}

	setupGracefulShutdown() {
		const shutdown = async () => {
			this.logger.info('Stopping broker');
			this.stopAllServices();
			this.logger.info('Stopped broker');
			process.exit(0);
		};

		process.on('SIGINT', shutdown);
		process.on('SIGTERM', shutdown);
		process.on('exit', shutdown);
	}
}
