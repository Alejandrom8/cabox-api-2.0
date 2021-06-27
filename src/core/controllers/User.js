const models = require('../models/User');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Token = require('../Token');

class UserController {

    constructor ({ password, ...data }) {
        return {
            ...data,
            password: bcrypt.hashSync(password, 10),
            id: nanoid(10)
        };
    }

    static async get ({ id, email }) {
        try {
            const where = {};
            if (id) where.id = id;
            if (email) where.email = email;

            return await models.User.findOne({ where, plain: true });
        } catch (error) {
            console.error(error);
        }
    }

    static async create (data) {
        try {
            const emailExists = await this.get({ email: data.email });
            if (emailExists) throw new Error('The email already exists');
            const user = new UserController(data);
            await models.User.create(user);
            return await this.get({ id: user.id  });
        } catch (error) {
            console.error(error);
        }
    }

    static async update (data) {
        try {
            if (data.email) throw new Error('Your email cannot be updated');
            const userExists = await this.get({ id: data.id });
            if (!userExists) throw new Error('User does\'t exists');
            await models.User.update(data, { where: { id: userExists.id } });
            return await his.get({ id: userExists.id });
        } catch (error) {
            console.error(error);
        }
    }
}

exports.UserController = UserController;

class AuthController {
    static async login (email, password) {
        try {
            const userExists = await UserController.get({ email });
            if (!userExists) throw new Error('Wrong email or password');

            const passwordIsCorrect = bcrypt.compareSync(password, userExists.password);
            if (!passwordIsCorrect) throw new Error('Wrong email or password');

            return {
                user: userExists,
                token: await Token.create(userExists.id, 'auth'),
                refreshToken: await Token.create(userExists.id, 'refresh')
            };
        } catch (error) {
            console.error(error);
        }
    }

    static async signUp (data) {
        try {
            const createResult = await UserController.create(data);
            if (!createResult) throw new Error('The signUp went wrong');
            return {
                token: await Token.create(createResult.id, 'auth'),
                refreshToken: await Token.create(createResult.id, 'refresh')
            };
        } catch (error) {
            console.error(error);
        }
    }

    static async refresh (refreshToken) {
        const { token, data } = await Token.refresh(refreshToken);
        const user = await UserController.get({ id: data.userId });
        return { token, user };
    }
}

exports.AuthController = AuthController;