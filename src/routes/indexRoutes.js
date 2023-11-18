const express = require('express')

const router = express()

router.get('/', (req, res) => {
  res.status(200).send('Ok')
})

module.exports = router
