require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('./models');
const defineAuthRoutes = require('./routes/auth.route');
const defineUserRoutes = require('./routes/user.route');

const app = express();

app
	.use(cors())
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.json({
		message: 'Hello World!'
	});
});

defineAuthRoutes(app);
defineUserRoutes(app);

app.listen(process.env.APP_PORT, () => {
	console.log('Server is running on port ' + process.env.APP_PORT);
});

Database.init();