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
		// TODO: load env file
		// TODO: load config file
		this.startBroker();
	}

	loadOptions(args: string[]) {
		this.logger.info('RUNNER', 'Loading runner options');
		program.option('-d, --debug', 'output extra debugging');
		program.option('-m, --mask <mask>', 'file mask to services');
		program.parse(args);
		this.options = program.opts();
		this.logger.info('RUNNER', 'Loaded runner options');
	}

	startBroker() {
		this.logger.info('RUNNER', 'Starting broker');
		if (this.broker) return;

		this.broker = new Broker();
		this.broker.logger = this.logger;

		this.broker
			.loadServices('', this.options.mask || '**/*.service.ts')
			.then(() => {
				return this.broker.startAllServices();
			})
			.then(() => {
				this.logger.info('RUNNER', 'Started broker and services');
			})
			.catch(error => {
				this.logger.error('RUNNER', 'Error starting broker: ' + error.message);
			});
	}
}

new Runner().start(process.argv);
process.stdin.resume();
