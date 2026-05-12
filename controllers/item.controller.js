const Validator = require("fastest-validator");
const v = new Validator();
exports.v = v;
const { get } = require("../routes/item.routes");
const { where } = require("sequelize");


const { Op } = require("sequelize");
const { response } = require("../helpers/response.formater");
const { Item } = require('../models');
const { v } = require("./item.controller");

module.exports = {
    createItem: async (req, res) => {
        try {
            const { name, stock } = req.body;
            const schema = {
                name: { type: "string", min: 2 },
                stock: { type: "number", positive: true, integer: true }
            };
            const data = {
                name: name,
                stock: Number(stock),
            };
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "validate Error", validate));
            }
            if (!req.file) {
                return res.status(400).json(response(400, "image must be uploaded"));
            }
            const item = await Item.create({
                name: data.name,
                stock: data.stock,
                image: req.file.filename,
            });
            return res.status(201).json(response(201, "created", item));
        } catch (error) {
            return res.status(500).json(response(500, "server Error", error.message));
        }
    },
    getItem: async (req, res) => {
        try {
            const { name } = req.quary; //req.quary mengambil data dati tab params
            const item = await Item.findAll({
                where:name ? {
                    name: {
                         [Op.like]: '%${name}%',
                    }
                }
            } 
        );
        } finally { };
        return res.status(200).json(response(200, "succes", item));
    }, catch(error) {
        return res.status(500).json(response(500, "server Error", error.message));
    }
};
