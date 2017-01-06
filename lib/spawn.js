import path from 'path';
import { spawn } from 'child_process';
import { readFile } from 'fs';

export default (options, callback) => {
	const execPath = path.resolve(process.env.BIN_PATH);
	const confPath = path.resolve(__dirname, '..', 'profiles', `${options.charName}.simc`);
	const jsonPath = path.resolve(__dirname, '..', 'reports', `${options.charName}.json`);
	const args = [
		`armory=${Object.values(options).map((value) => (
			encodeURIComponent(value)
		)).join(',')}`,
		`save=${confPath}`
	];
	const simc = spawn(execPath, args);

	simc.stdout.on('data', (data) => {
		if (process.env.NODE_ENV === 'dev') {
			console.info(data.toString());
		}
	});

	simc.stderr.on('data', (data) => {
		if (process.env.NODE_ENV === 'dev') {
			console.error(data.toString());
		}
	});

	simc.on('error', (err) => {
		callback(err);
	});

	simc.on('close', (code) => {
		if (process.env.NODE_ENV === 'dev') {
			console.info(`Exit code: ${code}`);
		}

		return !code ? readFile(confPath, (err, data) => (
			err ? callback(err) : callback(null, data.toString())
		)) : callback(new Error('An error occurred within the simc engine'));
	});
};
