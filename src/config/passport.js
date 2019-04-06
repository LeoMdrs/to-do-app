const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
// Importando Modelo
const Usuario = require('../models/Usuario');


// Autenticação do login
    passport.use(new LocalStrategy ({
        
        usernameField: 'email',
        passwordField: 'senha' //dizendo que vou tratar o item 'senha' como password

    }, async (email, password, done) => {
        // Pesquisando por usuário com o email inserido
        const usuario = await Usuario.findOne({email: email});
        
        if(!usuario){ // Se não existe usuário com esse email
            return done(null, false, { message: 'Usuário não encontrado.'});

        } else {
            // Chamando o método de comparar senhas criptografadas que está definido no model Usuario
            const match = await usuario.matchSenha(password);

            if(match){ // Se senha inserida for a do usuário com o email inserido...
                return done(null, usuario);
            } else {
                return done(null, false, {message: 'Senha incorreta.'});
            }
        }
    }));


// Controlar sessões do usuário

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        });
    });

