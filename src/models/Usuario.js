const mongoose = require('mongoose');
const { Schema } = mongoose; // Importando função de schema do mongoose

const bcrypt = require('bcryptjs');

//Criando Schema (Tabela pro bd)
    const UsuarioSchema = new Schema({
        nome: {type: String, required: true},
        email: {type: String, required: true},
        senha: {type: String, required: true},
        data: {type: Date, default: Date.now} 
    })

// Metodo para criptorafar senhas utilizando o módulo bcryptjs
    UsuarioSchema.methods.criptografarSenha = async (senha) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);
        return hash;
    }

//Receber uma senha e comparar com a que está no banco de dados
    UsuarioSchema.methods.matchSenha = async function (senha) {
        return await bcrypt.compare(senha, this.senha);
    }

module.exports = mongoose.model('Usuario', UsuarioSchema)