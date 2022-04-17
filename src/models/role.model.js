class RoleModel {

	constructor(DataTypes) {
		this.id = {
			type: DataTypes.INTEGER,
			primaryKey: true
		};

		this.name = {
			type: DataTypes.STRING
		};
	}

}

module.exports = RoleModel;