require('dotenv').config();

module.exports = {
	secret: process.env.AUTH_SECRET,
	expiresIn: 86400,
	type: 'Bearer',
	passwordHashingSaltRounds: 8
};