const express = require('express')
const user = require('../controllers/usersControllers')

const router = express()

router.post('/create', user.create)
router.post('/login', user.login)

module.exports = router
