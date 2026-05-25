const express = require('express')
const router = express.Router()

const loanController = require('../controllers/loan.controller')
const upload = require('../middlewares/upload')
const { route } = require('./item.routes')

router.post('/',upload.none(),loanController.createLoan)
router.get('/',loanController.getLoans)
router.post('/return',upload.none(),loanController.createReturn)

module.exports = router