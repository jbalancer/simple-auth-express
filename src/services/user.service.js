const Database = require('../models');
const authService = require('../services/auth.service');

class UserService {

	constructor(userModel, authService) {
		this.userModel = userModel;
		this.authService = authService;
	}

	async create(user) {
		if (!user.username || !user.email || !user.password) return null;

		return this.userModel.create({
			...user,
			password: this.authService.hashPassword(user.password)
		});
	}

	async getUserByUsername(username) {
		if (!username) return null;

		return this.userModel.findOne({ where: { username } });
	}

}

module.exports = new UserService(Database.models.user, authService);