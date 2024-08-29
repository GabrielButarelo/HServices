import { OptionValues, program } from 'commander';
import Broker from './broker';
import Logger from './logger';
import 'reflect-metadata';

export default class Runner {
	private logger: Logger;
	private options: OptionValues;
	private broker: Broker;

	start(args: string[]) {
		this.logger = new Logger();

		this.loadOptions(args);
		// todo: load env file
		// todo: load config file
		this.startBroker();
	}

	loadOptions(args: string[]) {
		this.logger.info('Loading runner options');
		// todo: create options
		program.option('-d, --debug', 'output extra debugging');
		program.option('-m, --mask', 'file mask to services');
		program.parse(args);
		this.options = program.opts();
		this.logger.info('Loaded runner options');
	}

	startBroker() {
		this.logger.info('Starting broker');
		if (this.broker) return;

		this.broker = new Broker();
		this.broker.logger = this.logger;

		Promise.resolve(this.broker.loadServices())
			.then(() => {
				this.options;
				this.logger.info('Started broker');
			})
			.catch(error => {
				this.logger.error('Error start broker: ' + error.message);
			});
	}
}

new Runner().start(process.argv);
