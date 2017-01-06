import express from 'express';
import simc from './lib/spawn';

const app = express();

app.get('/', (req, res) => {
	const options = Object.assign({}, {
		armory: 'us,burning%20legion,jelq',
		save: 'profiles/jelq.simc',
		/*json: 'jelq.json',
		max_time: 300,
		report_details: 0,
		ilevel_raid_report: 1,
		iterations: 1000,
		target_error: 0.2*/
	});

	simc(options, (err, data) => (
		err ? console.error(err) : res.set('Content-Type', 'text/plain').send(data)
	));
});

app.listen(process.env.SERVER_PORT, () => {
	console.info(`Listening on port ${process.env.SERVER_PORT}`);
});
