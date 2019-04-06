const express = require('express')
const router = express.Router() //Função que facilita criação de rotas

// importando a estrategia de autenticação
const passport = require('passport');
// importando o modelo
const Usuario = require('../models/Usuario');


// Rotas - Entrar / Login

    router.get('/usuarios/login', (req, res) => {
        res.render('usuarios/login')
    });

    router.post('/usuarios/entrar', passport.authenticate('local', {
        // Função de passport que recebe dados do formulário de login, e autentica-os por meio de LocalStrategy no arquivo passport.js
        successRedirect: '/notas',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    }));

// Rotas - Registrar / Salvar

    router.get('/usuarios/registrar', (req, res) => {
        res.render('usuarios/registrar')
    })

    router.post('/usuarios/salvar-registro', async (req, res) => {
        const {nome, email, senha, senha2} = req.body;
        const emailUsuario = await Usuario.findOne({email: email});

        const errors = [];
        
        if(senha != senha2){
            errors.push({text: 'Senhas não coincidem!'})
        }
        if(senha.length < 4) {
            errors.push({text: 'Senha deve ter pelo menos 4 caracteres!'})
        }
        if(nome.length < 3) {
            errors.push({text: 'Nome deve ter pelo menos 3 caracteres!'})
        }
        if(emailUsuario){
            errors.push({text: 'O email já está em uso!'})
        }
        
        if(errors.length > 0){
            res.render('usuarios/registrar', {errors, nome, email, senha, senha2})
            // console.log(req.body)

        } else {
            
            // Criando novo usuario
            const novoUsuario = new Usuario({nome, email, senha})
            // Criptografando senha
            novoUsuario.senha = await novoUsuario.criptografarSenha(senha);
            // Salvando no banco
            await novoUsuario.save();

            //Mensagens flash
            req.flash('success_msg', 'Usuário registrado com sucesso! Você já pode logar na sua conta.')
            res.redirect('/usuarios/login')
        }

    });

// Rota - logout
    router.get('/usuarios/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

module.exports = router