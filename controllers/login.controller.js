const Validator = require("fastest-validator");
const v = new Validator();
const { User } = require('../models');
const { response } = require("../helpers/response.formater");
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const { auth_secret } = require('../config/base.config')

module.exports = {
    loginAuth: async (req, res) => {
        try {
            const { username, password } = req.body;
            const schema = {
                username: { type: "string" },
                password: { type: "string" }
            }
            const data = {
                username: username,
                password: password,
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "validation error", validate));
            }
            const user = await User.findOne({ where: { username: data.username } });
            // ambil data ke model 
            if (!user) {
                return res.status(400).json(response(400, "validation error", "username not registered"));
            }
            const checkPassword = passwordHash.verify(data.password, user.password);
            if (!checkPassword) {
                return res.status(400).json(response(400, "validation error", "password doesn't match"));
            }
            const token = jwt.sign({
                username: user.username, name: user.name,
                userId: user.id
            }, auth_secret, {
                expiresIn: '1h'
            });
            //format output :
            const formatOutput = {
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,//ambil data selain password
                },
                token: token
            }
            return res.status(200).json(response(200, "success", formatOutput));
        } catch (error) {
            return res.status(500).json(response(500, "server Error", error.message))
        }
    }
}