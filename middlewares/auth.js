const jwt = require('jsonwebtoken')
const {response} = require('../helpers/response.formater')
const {auth_secret} = require('../config/base.config')

module.exports = {
    verifyToken: async(req,res,next) => {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).json(response(401,"unathorized"));
        }
        try {
            const checkToken = jwt.verify(token,auth_secret);
            req.user = checkToken;
            next();
        }catch (error) {
            return res.status(401).json(response(401,"unauthorized"));
        }
    }
}