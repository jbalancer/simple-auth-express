const { verifySignUp } = require('../middleware');
const authController = require('../controllers/auth.controller');

function defineAuthRoutes(app) {
	app.post(
		'/api/auth/signup',
		[
			verifySignUp.checkDuplicateUsernameOrEmail,
			verifySignUp.checkRolesExisted
		],
		authController.signUp.bind(authController)
	);

	app.post(
		'/api/auth/signin',
		authController.signIn.bind(authController)
	);
}

module.exports = defineAuthRoutes;