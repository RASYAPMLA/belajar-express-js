const Validator = require("fastest-validator");
const v = new Validator();
const { Item, Loan } = require('../models');
const { response } = require("../helpers/response.formater");
const { where } = require("sequelize");
const { get } = require("../routes/item.routes");
module.exports = {
    createLoan: async (req, res) => {
        try {
            const { item_id, name, total_item, date } = req.body;
            const schema = {
                item_id: { type: "number", positive: true, integer: true },
                name: { type: "string" },
                total_item: { type: "number", positive: true, integer: true },
                date: { type: "date" }
            }
            const data = {
                item_id: Number(item_id),
                name: name,
                total_item: Number(total_item),
                date: new Date(date),
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "validasi Error", validate));
            }
            const item = await Item.findByPk(item_id);
            if (!item) {
                return res.status(400).json(response(400, "validasi Error", "item not found"));
            }
            if (data.total_item > item.stock) {
                return res.status(400).json(response(400, "validasi Error", `stock only available ${item.stock}`))
            }
            const createData = await Loan.create({
                item_id: data.item_id,
                name: data.name,
                total_item: data.total_item,
                date: data.date,
            });
            //kurangi stock dari item
            const updateStock = await Item.update({
                stock: item.stock - data.total_item
            }, {
                where:{id:data.item_id}
            });
            return res.status(201).json(response(201, "success create loan", createData));
        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message))
        }
    },
    getLoans: async (req,res) => {
        try {
            const loans = await Loan.findAll({include:Item});
            return res.status(200).json(response(200,"succes",loans));
        }catch (error) {
            return res.status(500).json(response(500,"server error",error.message))
        }
    }
}