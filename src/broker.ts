import { glob } from 'glob';
import path from 'path';
import Logger from './logger';
import Service from './service';

export default class Broker {
	private services: Map<string, Service> = new Map();
	public logger: Logger;

	constructor() {}

	public registerService(name: string, serviceClass: ServiceConstructor) {
		const service = new serviceClass();
		this.services.set(name, service);
		service.on('started', () => console.log(`${name} service started`));
		service.on('stopped', () => console.log(`${name} service stopped`));
	}

	// async loadServices() {
	// 	const serviceFiles = glob.sync('**/*.service.ts');

	// 	if (!serviceFiles.length) {
	// 		this.logger.error(`Not found match files with mask`);
	// 		return;
	// 	}

	// 	for (const serviceFile of serviceFiles) {
	// 		const { default: serviceImport } = await import(path.resolve(serviceFile));

	// 		const service = new serviceImport();

	// 		const metadata = Reflect.getMetadata('eventConfig', service.constructor.prototype);
	// 		console.log(metadata);
	// 		if (metadata) {
	// 			console.log(metadata);
	// 		}

	// 		if (!(service instanceof Service)) {
	// 			this.logger.error(`The class ${serviceImport.name} not is instance of service`);
	// 			continue;
	// 		}

	// 		if (!service.group || !service.name) {
	// 			this.logger.error(`The class ${serviceImport.name} not contains group or/and name`);
	// 			continue;
	// 		}

	// 		if (this.listServices.get(service.name, service.group)) {
	// 			this.logger.error(`The service ${service.name} for group ${service.group} already exists`);
	// 			continue;
	// 		}

	// 		this.listServices.add(service);
	// 		this.logger.info(`The service ${service.name} for group ${service.group} is registred`);
	// 	}
	// }

	async loadServices(broker: Broker, rootDir: string) {
		const files = this.findServiceFiles(rootDir);

		for (const file of files) {
			const modulePath = path.resolve(file);
			const module = await import(modulePath);

			for (const key in module) {
				const target = module[key];

				console.log(target);

				if (typeof target === 'function') {
					const name = Reflect.getMetadata('service:name', target);
					const group = Reflect.getMetadata('service:group', target);
					if (name && group) {
						broker.registerService(name, target);
					}
				}
			}
		}
	}

	findServiceFiles(rootDir: string): string[] {
		const pattern = path.join(rootDir, '**/*.ts');
		return glob.sync(pattern);
	}
}
