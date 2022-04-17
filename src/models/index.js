const config = require('../config/db.config');
const UserModel = require('./user.model');
const RoleModel = require('./role.model');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	config.DB,
	config.USER,
	config.PASSWORD,
	{
		host: config.HOST,
		dialect: config.dialect,
		pool: config.pool,
		logging: console.log
	}
);

const Database = {
	Sequelize,
	sequelize,
	models: {
		user: sequelize.define('users', new UserModel(Sequelize)),
		role: sequelize.define('roles', new RoleModel(Sequelize)),
	},
	roles: [
		'USER',
		'ADMIN',
		'MODERATOR'
	],
	defaultRole: 'USER',
	initRoles() {
		this.roles.forEach((name, index) =>
			this.models.role.create({ id: index + 1, name }));

		return this;
	},
	init() {
		this.sequelize.sync({ force: true })
			.then(() => {
				console.log('Drop and Resync DB');

				this.initRoles();
			});
	}
};

Database.models.user.belongsToMany(Database.models.role, {
	through: 'user_roles',
	foreignKey: 'userId',
	otherKey: 'roleId'
});

Database.models.role.belongsToMany(Database.models.user, {
	through: 'user_roles',
	foreignKey: 'roleId',
	otherKey: 'userId'
});

module.exports = Database;