const Validator = require("fastest-validator");
const v = new Validator();
const { where, or } = require("sequelize");
const { Op } = require("sequelize");
const { response } = require("../helpers/response.formater");
const { Item } = require('../models');
const path = require("path");
const fs = require("fs");


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
            const { name, sortBy, order } = req.query;

            const item = await Item.findAll({
                where: name ? {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                } : {},
                order: sortBy && order ? [
                    [sortBy, order],
                ] : []
            }
            );
            return res.status(200).json(response(200, "succes", item));
        } catch (error) {
            return res.status(500).json(response(500, "server Error", error.message));
        }
    },
    detailItem: async (req, res) => {
        try {
            const { id } = req.params;
            const detail = await Item.findByPk(id);
            return res.status(200).json(response(200, "succes", detail));
        } catch (error) {
            return res.status(500).json(response(500, "server Error", error.message));
        }
    },
    updateItem: async (req, res) => {
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
            const { id } = req.params;
            const itemBefore = await Item.findByPk(id);
            //jika ada gambar baru yg di upload ,hapus gambar lama
            if (req.file) {
                const imageName = itemBefore.getDataValue('image');
                const filePosition = path.join(__dirname, '../uploads', imageName);
                if (fs.existsSync(filePosition)) {
                    fs.unlinkSync(filePosition);
                }
            }
            const update = await Item.update({
                name: data.name,
                stock: data.stock,
                image: req.file ? req.file.filename : itemBefore.getDataValue('image')
            },
                {
                    where: { id: id }
                });
            const newItem = await Item.findByPk(id);
            return res.status(200).json(response(200, "update", newItem));
        } catch (error) {
            return res.status(500).json(response(500, "server Error", error.message))
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findByPk(id);
            if (!item) {
                return res.status(404).json(response(404, "item not found"));
            }

            const imageName = item.getDataValue('image');
            const filePosition = path.join(__dirname, '../uploads', imageName);
            if (fs.existsSync(filePosition)) {
                fs.unlinkSync(filePosition);
            }

            await Item.destroy({
                where: { id: id },
            });
            return res.status(200).json(response(200, "success"))
        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message))
        }
    }
}
