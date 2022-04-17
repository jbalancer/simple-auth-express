const Database = require('../models');

class RoleService {

	constructor(userModel, roleModel, allRoles, defaultRole, dbOp) {
		this.userModel = userModel;
		this.roleModel = roleModel;
		this.allRoles = allRoles;
		this.defaultRole = defaultRole;
		this.dbOp = dbOp;
	}

	checkExistRoles(roles) {
		return roles.every(role => this.allRoles.includes(role));
	}

	async checkUserExistRolesByUserId(userId, shouldHaveRoles) {
		if (!userId) return false;

		return this.userModel.findByPk(userId)
			.then(user => user.getRoles()
				.then(roles => shouldHaveRoles
					.some(shouldHaveRole => roles
						.find(role => role.name === shouldHaveRole))));
	}

	checkIsAdminByUserId(userId) {
		return this.checkUserExistRolesByUserId(userId, [ 'ADMIN' ]);
	}

	checkIsModeratorByUserId(userId) {
		return this.checkUserExistRolesByUserId(userId, [ 'MODERATOR' ]);
	}

	checkIsAdminOrModeratorByUserId(userId) {
		return this.checkUserExistRolesByUserId(userId, [ 'ADMIN', 'MODERATOR' ]);
	}

	findByNameList(roleNames) {
		return this.roleModel.findAll({
			where: {
				name: { [this.dbOp.or]: roleNames }
			}
		});
	}

	findByName(roleName) {
		return this.roleModel.findOne({ where: { name: roleName } });
	}

	getDefaultRole() {
		return this.findByName(this.defaultRole);
	}

	async setRolesForUser(user, roles) {
		const foundRoles = roles && roles.length
			? await this.findByNameList(roles)
			: [ await this.getDefaultRole() ];

		return user.setRoles(foundRoles);
	}

}

module.exports = new RoleService(
	Database.models.user,
	Database.models.role,
	Database.roles,
	Database.defaultRole,
	Database.Sequelize.Op
);