const JWT = require('jsonwebtoken');
const config = require('../config/global.json');

const TokenExpireTimeDict = {
    'auth': 900,
    'refresh': '7d',
    '': 0,
};

module.exports = class Token {
    constructor (userId, type) {
        this.userId = userId;
        this.type = type;
    }

    static validate (req) {
        const tokenHeader = String(req.headers.authorization);

        // if authorization token doesn't exists, don't authorize the request
        if (!tokenHeader) return null;

        // getting token from string
        const token = tokenHeader.split(' ')[1];

        if (!token) return null;

        try {
            return JWT.verify(token, config.JWT_SECRET);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This method generates a token with the ID of the authenticated user.
     * @param {String} userId - the system generated ID to identify this token.
     * @param {Token} type - tipo de contenido.
     * @returns {Promise<String>} the generated json web token.
     */
    static async create (userId, type) {
        return await new Promise((resolve, reject) => {
            JWT.sign(
                { userId, type },
                config.JWT_SECRET,
                {expiresIn: TokenExpireTimeDict[type]},
                (err, encoded) => {
                    if(err) reject(err);
                    resolve(encoded);
                }
            )
        })
    }

    static async refresh (refreshToken) {
        const data = JWT.verify(refreshToken, config.JWT_SECRET);
        if (data.type !== 'refresh') throw {
            status: 401,
            message: 'the refresh token is invalid'
        }

        const token = await this.create(data.userId, 'auth');
        return { token, data }
    }
}