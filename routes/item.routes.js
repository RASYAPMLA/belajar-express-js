const express = require('express')
const router = express.Router()

const itemController = require('../controllers/item.controller')
const uploads = require('../middlewares/upload')

router.post('/',uploads.single('image'),itemController.createItem)
router.get('/',itemController.getItem)

router.get('/:id',itemController.detailItem)
router.put('/:id',uploads.single('image'),itemController.updateItem)
router.delete('/:id',itemController.deleteItem)

module.exports = router