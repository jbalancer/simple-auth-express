const roleService = require('../services/role.service');
const { StatusCodes } = require('http-status-codes');
const authConfig = require('../config/auth.config');
const authService = require('../services/auth.service');

const verifyToken = (req, res, next) => {
	const [ authType, accessToken ] = (req.header('authorization') || '').split(' ');
	const authTypeIsCorrect = authType === authConfig.type;

	if (!authTypeIsCorrect || !accessToken) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.send({
				message: authTypeIsCorrect
					? 'Failed! Empty token received'
					: 'Failed! Invalid authorization type'
			});
	}

	authService.verifyAccessToken(accessToken)
		.then(userId => {
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.send({
						message: 'Failed! Please authorize'
					});
			}

			req.userId = userId;

			next();
		});
};

const isHasRole = (roleServiceMethodName) =>
	(req, res, next) => {
		roleService[roleServiceMethodName](req.userId)
			.then(hasRole => {
				if (hasRole) return next();

				res
					.status(StatusCodes.FORBIDDEN)
					.send({
						message: 'Failed! For your role access denied'
					});
			});
	};

const isAdmin = isHasRole('checkIsAdminByUserId');

const isModerator = isHasRole('checkIsModeratorByUserId');

const isAdminOrModerator = isHasRole('checkIsAdminOrModeratorByUserId');

module.exports = {
	verifyToken,
	isAdmin,
	isModerator,
	isAdminOrModerator
};