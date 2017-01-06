import express from 'express';
import bodyParser from 'body-parser';
import simc from './lib/spawn';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/simc/profile', (req, res) => {
	/**
	 * {
	 *   json: '${options.charName}.json',
	 *   max_time: 300,
	 *   report_details: 0,
	 *   ilevel_raid_report: 1,
	 *   iterations: 1000,
	 *   target_error: 0.2
	 * 	}
	 */
	const options = req.body;

	if (!options.region || !options.realm || !options.charName) {
		return res.status(400).json('Required parameters not present');
	}

	return simc(options, (err, data) => (
		err ? res.status(500).json(err) : res.set('Content-Type', 'text/plain').send(data)
	));
});

app.listen(process.env.SERVER_PORT, () => {
	console.info(`Listening on port ${process.env.SERVER_PORT}`);
});
