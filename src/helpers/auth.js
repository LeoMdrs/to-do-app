const helpers = {};

// Método criado para saber se usuário está logado no site
    helpers.estaAutenticado = (req, res, next) => {
        
        // Método do passport que verifica se está autenticado
        if(req.isAuthenticated()){
            // se usuario está autenticado, continua com a seguinte função
            return next();
        }
        // se não está logado...
        req.flash('error_msg', 'Não autenticado');
        res.redirect('/usuarios/login');

    }

// Para poder usar em outros lugares
    module.exports = helpers;