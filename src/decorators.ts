export function Event(config: { name: string; group: string }) {
	return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
		Reflect.defineMetadata('eventConfig', config, target, propertyKey);
	};
}

export function ServiceDecorator(config: { name: string; group: string }) {
	return function (target: any) {
		Reflect.defineMetadata('serviceConfig', config, target);
	};
}
