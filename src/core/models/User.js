const db = require('../connection');
const Sequelize = require('sequelize');

class User extends Sequelize.Model {}

User.init({
    id: {
        type: Sequelize.STRING(10),
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(256),
        allowNull: false
    }
}, {
    sequelize: db,
    timestamps: true,
});

exports.User = User;

exports.sync = async (options = { force: false, alter: true }) => {
    console.log('User sync');
    await User.sync(options);
};