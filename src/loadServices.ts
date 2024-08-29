import Broker from './broker';

export async function loadServices(broker: Broker, rootDir: string) {
	const files = findServiceFiles(rootDir);

	for (const file of files) {
		const modulePath = path.resolve(file);
		const module = await import(modulePath);

		for (const key in module) {
			const target = module[key];
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
