const express = require('express')
const router = express.Router() //Função que facilita criação de rotas

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/sobre', (req, res) => {
    res.render('sobre')
})

module.exports = router