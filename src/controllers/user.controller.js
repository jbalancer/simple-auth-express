const Controller = require('../core/Controller');

class UserController extends Controller {

	pingPublicAccess(req, res) {
		return this.successResponse(res, { message: 'Success! Public' });
	}

	pingUserAccess(req, res) {
		return this.successResponse(res, { message: 'Success! User' });
	}

	pingAdminAccess(req, res) {
		return this.successResponse(res, { message: 'Success! Admin' });
	}

	pingModeratorAccess(req, res) {
		return this.successResponse(res, { message: 'Success! Moderator' });
	}

}

module.exports = new UserController();