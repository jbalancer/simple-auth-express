const authService = require('../services/auth.service');
const roleService = require('../services/role.service');
const { StatusCodes } = require('http-status-codes');

const checkDuplicateUsernameOrEmail = (req, res, next) => {
	const { username, email } = req.body;

	authService.checkExistUserByUsernameOrEmail(username, email)
		.then(userExist => {
			if (userExist === false) return next();

			res
				.status(StatusCodes.BAD_REQUEST)
				.send({
					message: userExist === true
						? 'Failed! User already exists by this username or email'
						: 'Failed! Please input username or email'
				});
		});
};

const checkRolesExisted = (req, res, next) => {
	const { roles } = req.body;

	if (!roles || roleService.checkExistRoles(roles)) return next();

	res
		.status(StatusCodes.BAD_REQUEST)
		.send({
			message: 'Failed! Incorrect roles'
		});
};

module.exports = {
	checkDuplicateUsernameOrEmail,
	checkRolesExisted
};