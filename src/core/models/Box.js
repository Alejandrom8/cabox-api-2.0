const db = require('../connection');
const Sequelize = require('sequelize');
const user = require('./User');

class Box extends Sequelize.Model {}

Box.init({
    id: {
        type: Sequelize.STRING(10),
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(140),
        allowNull: false,
    },
}, {
    sequelize: db,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: user.User,
                as: 'owner'
            }
        ]
    }
});

Box.belongsTo(user.User, {
    as: 'owner',
    foreignKey: {
        name: 'ownerId',
        allowNull: true,
        defaultValue: null
    }
});

exports.Box = Box;

class Item extends Sequelize.Model {}

Item.init({
    id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
}, {
    sequelize: db,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: Box,
                as: 'box'
            }
        ]
    }
});

Item.belongsTo(Box, {
    as: 'box',
    foreignKey: 'boxId'
});

exports.Item = Item;

exports.sync = async (options = {force: false, alter: true}) => {
    console.log('Box sync');
    await Box.sync(options);
    console.log('Item sync');
    await Item.sync(options);
};