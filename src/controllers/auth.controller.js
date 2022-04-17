const Database = require('../models');
const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const roleService = require('../services/role.service');
const Controller = require('../core/Controller');

class AuthController extends Controller {

	constructor(userService, authService, roleService) {
		super();

		this.userService = userService;
		this.authService = authService;
		this.roleService = roleService;
	}

	signUp(req, res) {
		const { username, email, password, roles } = req.body;

		this.userService.create({ username, email, password })
			.then(user => {
				if (!user) {
					return this.errorResponse(res, 'Failed! Invalid user data', StatusCodes.BAD_REQUEST);
				}

				this.roleService.setRolesForUser(user, roles)
					.then(() => this.successResponse(res, {
						message: "User was registered successfully",
						accessToken: this.authService.generateToken(user)
					}));
			})
			.catch(error => this.handleError(res, error));
	}

	signIn(req, res) {
		const { username, password } = req.body;

		this.userService.getUserByUsername(username)
			.then(user => {
				if (!user) {
					return this.errorResponse(res, 'Failed! User not found', StatusCodes.NOT_FOUND);
			  	}

				const passwordIsValid = this.authService.verifyPassword(password, user.password);

				if (!passwordIsValid) {
					return this.errorResponse(res, 'Failed! Invalid Password', StatusCodes.UNAUTHORIZED);
				}

				user.getRoles()
					.then(roles => this.successResponse(res, {
						id: user.id,
						username: user.username,
						email: user.email,
						roles: roles.map(role => role.name),
						accessToken: this.authService.generateToken(user)
					}));
			})
			.catch(error => this.handleError(res, error));
	}

}

module.exports = new AuthController(userService, authService, roleService);