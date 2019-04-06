const mongoose = require('mongoose')

//Configs exenciais para conectar o bd (nome: notes-app-db -> cria altomaticamente o bd)
    mongoose.connect('mongodb://localhost/notes', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(
        //se funcionar, então faça...
        db => console.log('BD está conectado')
    ).catch(
        //se não funcionar faça...
        err => console.error(err)
    )