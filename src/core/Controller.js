const { StatusCodes } = require('http-status-codes');

class Controller {

	handleError(res, error) {
		return this.errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}

	errorResponse(res, message, status) {
		return res
			.status(status)
			.send({ message });
	}

	successResponse(res, data, status = StatusCodes.OK) {
		return this.response(res, data, status);
	}

	response(res, data, status) {
		return res
			.status(status)
			.send(data);
	}

}

module.exports = Controller;