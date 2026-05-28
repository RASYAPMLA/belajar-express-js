const Validator = require("fastest-validator");
const v = new Validator();
const { Item, Loan, Return } = require('../models');
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
                where: { id: data.item_id }
            });
            return res.status(201).json(response(201, "success create loan", createData));
        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message))
        }
    },
    getLoans: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            //offset
            const offset = (page - 1) * limit;
            const { count, rows } = await Loan.findAndCountAll({
                include: Item,
                offset: offset,
                limit: limit
            });
            const formatPagination = {
                data: rows,
                limit: limit,
                rangeData: (offset + 1) + "-" + (offset + rows.length),

                currentPage: page,
                totalPage: Math.ceil(count / limit),
                total: count,
            }
            return res.status(200).json(response(200, "succes", formatPagination));
        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message))
        }
    },
    
        createReturn: async (req, res) => {
        try {
            const { loan_id, total_item, notes, date } = req.body;
            const schema = {
                loan_id: { type: "number", positive: true, integer: true },
                total_item: { type: "number", positive: true, integer: true },
                notes: { type: "string" },
                date: { type: "date" },
            }
            const data = {
                loan_id:Number(loan_id),
                total_item:Number(total_item),
                notes:notes ?? "-",
                date:new Date(date),
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "validate Error", validate));
            }
            const loanData = await Loan.findByPk(loan_id);
            if (!loanData) {
                return res.status(400).json(response(400, "validasi error", 'loan not found'));
            }
            if (data.total_item > loanData.total_item) {
                return res.status(400).json(response(400, "validasi error", "total item return more than loan"));
            }

            const itemData = await Item.findByPk(loanData.item_id);
            const createReturn = await Return.create({
                loan_id: data.loan_id,
                total_item: data.total_item,
                notes: data.notes,
                date: data.date,
            });
            const updateStock = await Item.update({
                stock: itemData.stock + data.total_item
            }, {
                where: { id: itemData.id }
            });
            return res.status(201).json(response(201, "created", createReturn))
        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message))
        }
    }

}