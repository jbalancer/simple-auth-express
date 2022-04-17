class UserModel {

	constructor(DataTypes) {
		this.username = {
			type: DataTypes.STRING
		};

		this.email = {
			type: DataTypes.STRING
		};

		this.password = {
			type: DataTypes.STRING
		};
	}

}

module.exports = UserModel;