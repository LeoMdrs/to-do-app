const mongoose = require('mongoose'); //para fazer esquema de dados
const {Schema} = mongoose;

//Criando Schema (Tabela pro banco de dados)
    const NotaSchema = new Schema({
        titulo: { type: String, required: true},
        descricao: { type: String, required: true},
        data: { type: Date, default: Date.now},
        //adicinado depois: campo para armazenar id do usuário dono da nota
        usuario: {type: String}
    });

//Exportando o schema
    module.exports = mongoose.model('Nota', NotaSchema)
