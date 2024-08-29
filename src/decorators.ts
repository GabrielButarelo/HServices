import Service from './service';

export function Event(config: { name: string; group: string }) {
	return function (target: any, propertyKey: string) {
		Reflect.defineMetadata('eventConfig', config, target, propertyKey);
	};
}

export function ServiceDecorator(config: { name: string; group: string }) {
	return function (target: any) {
		Reflect.defineMetadata('serviceConfig', config, target);
	};
}
