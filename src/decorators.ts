export function Event(config: { name: string; group: string }) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		Reflect.defineMetadata('eventConfig', config, target, propertyKey);
	};
}
