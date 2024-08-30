import kleur from 'kleur';

export default class Logger {
	info(origin: string, message: string) {
		const dateText = kleur.grey(new Date().toISOString());
		const typeText = kleur.green('INFO');
		const originText = kleur.blue(origin);
		const messageText = kleur.grey(': ' + message);

		console.log(`${dateText} ${typeText} ${originText}${messageText}`);
	}

	error(origin: string, message: string) {
		const dateText = kleur.grey(new Date().toISOString());
		const typeText = kleur.red('ERROR');
		const originText = kleur.blue(origin);
		const messageText = kleur.grey(': ' + message);

		console.log(`${dateText} ${typeText} ${originText}${messageText}`);
	}
}
