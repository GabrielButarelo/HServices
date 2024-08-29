import kleur from 'kleur';

export default class Logger {
	info(text: string) {
		console.log(kleur.cyan('[HServices] ') + kleur.white(text));
	}

	error(text: string) {
		console.log(kleur.red('[HServices] ') + kleur.white(text));
	}
}
