const express = require('express')
const router = express.Router()

const loanController = require('../controllers/loan.controller')
const upload = require('../middlewares/upload')

router.post('/',upload.none(),loanController.createLoan)
router.get('/',loanController.getLoans)

module.exports = router