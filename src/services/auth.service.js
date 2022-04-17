const Database = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth.config');

class AuthService {

	constructor(userModel, JWT, bcrypt, config, dbOp) {
		this.userModel = userModel;
		this.JWT = JWT;
		this.bcrypt = bcrypt;
		this.config = config;
		this.dbOp = dbOp;
	}

	generateToken(user) {
		return this.JWT.sign({ id: user.id }, this.config.secret, {
			expiresIn: this.config.expiresIn
		});
	}

	verifyAccessToken(accessToken) {
		return new Promise(resolve => {
			if (!accessToken) return resolve(null);

			this.JWT.verify(accessToken, this.config.secret, (err, decoded) =>
				resolve(err ? null : decoded.id));
		});
	}

	hashPassword(password) {
		return this.bcrypt.hashSync(password, this.config.passwordHashingSaltRounds);
	}

	verifyPassword(password, hash) {
		return this.bcrypt.compareSync(password, hash);
	}

	async checkExistUserByUsernameOrEmail(username, email) {
		if (!username && !email) return null;

		const count = await this.userModel.count({
			where: { [this.dbOp.or]: [ { username }, { email } ] }
		});

		return count > 0;
	}

}

module.exports = new AuthService(
	Database.models.user,
	JWT,
	bcrypt,
	authConfig,
	Database.Sequelize.Op
);