const express = require('express')
const router = express.Router() //Função que facilita criação de rotas

// Modelo
const Nota = require("../models/Nota")

// Autenticação (se usuário está logado)
// Apenas inserir a constante nas rotas que necessita
const { estaAutenticado } = require('../helpers/auth');

//Crud Notas

router.get('/notas', estaAutenticado, async(req, res) => {
    //Buscando todas as notas no bd que tem o id do usuario logado no campo 'usuario'
    const notas = await Nota.find({ usuario: req.user.id }).sort({date: 'desc'})
    res.render('notas/todas-notas', { notas }) //passando as notas para a view
})

router.get('/notas/add', estaAutenticado, (req, res) => {
    res.render('notas/add-nota')
})

router.get('/notas/edit/:id', estaAutenticado, async(req, res) => {
    const nota = await Nota.findById(req.params.id)
    
    res.render('notas/edit-nota', {nota})
})

router.delete('/notas/delete/:id', estaAutenticado, async(req, res) => {
    await Nota.findByIdAndDelete(req.params.id)
    
    //Mensagens flash
    req.flash('success_msg', 'Nota deletada com sucesso')
    
    res.redirect('/notas')
})


router.post('/notas/nova', estaAutenticado, async (req, res) => { //async para dizer que é um metodo onde tem processos assincronos
    const { titulo, descricao } = req.body;
    const errors = []
    const notaSalva = []

    if(!titulo){
        errors.push({text: "Por favor escreva um titulo"})
    }
    if(!descricao){
        errors.push({text: "Por favor escreva uma descrição"})
    }
    if(errors.length > 0){
        res.render('notas/add-nota', {
            errors,
            titulo,
            descricao
        });
    } else {

        const novaNota = new Nota({titulo, descricao}) //Criando nova nota
        novaNota.usuario = req.user.id;  //Salvando id do usuário logado na sessão, na coluna id do bd

        await novaNota.save(); //Salvando no bd - await para dizer que é assincrono (servidor ficar esperando) - executa todo para poder passar a proximo passo

        //Mensagens flash
        req.flash('success_msg', 'Nota criada com sucesso')

        res.redirect('/notas')

    }

})

router.put('/notas/salvar/:id', estaAutenticado, async (req, res) => {
    const { titulo, descricao } = req.body;
    // const errors = []
    await Nota.findByIdAndUpdate(req.params.id, { titulo, descricao })
    
    //Mensagens flash
    req.flash('success_msg', 'Nota editada com sucesso')

    res.redirect('/notas')
})

module.exports = router

