const { authJwt } = require('../middleware');
const userController = require('../controllers/user.controller');

function defineUserRoutes(app) {
	app.get(
		'/api/ping/public',
		userController.pingPublicAccess.bind(userController)
	);

	app.get(
		'/api/ping/user',
		[ authJwt.verifyToken ],
		userController.pingUserAccess.bind(userController)
	);

	app.get(
		'/api/ping/moderator',
		[ authJwt.verifyToken, authJwt.isModerator ],
		userController.pingModeratorAccess.bind(userController)
	);

	app.get(
		'/api/ping/admin',
		[ authJwt.verifyToken, authJwt.isAdmin ],
		userController.pingAdminAccess.bind(userController)
	);
}

module.exports = defineUserRoutes;