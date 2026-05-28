const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response.formater')
const { auth_secret } = require('../config/base.config')

module.exports = {
    verifyToken: async (req, res, next) => {
        let token = req.header('Authorization')

        console.log('TOKEN MASUK = ', token)

        if (!token) {
            return res.status(401).json(response(401, 'unauthorized'))
        }

        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1]
        }

        try {
            const decoded = jwt.verify(token, auth_secret)

            req.user = decoded

            next()
        } catch (error) {
            console.log(error)

            return res.status(401).json(response(401, 'unauthorized'))
        }
    }
}