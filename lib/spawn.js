import path from 'path';
import { spawn } from 'child_process';
import { readFile } from 'fs';

function parseArgs(options) {
	return Object.entries(options).map(([key, value]) => (
		`${key}=${value}`
	));
}

export default (options, callback) => {
	const args = parseArgs(options);
	const execPath = path.resolve(__dirname, '..', 'bin', 'simc');
	const confPath = path.resolve(__dirname, '..', options.save);
	//const jsonPath = path.resolve(__dirname, options.json);
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
