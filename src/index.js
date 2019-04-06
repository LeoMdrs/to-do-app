const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash'); //Mensagens flash
const passport = require('passport');

//Inicializações
    const app = express();
    require('./database');
    require('./config/passport');

//Configurações
    app.set('port', process.env.PORT || 3000) //se não tiver porta disponivel pegue a 3000
    app.set('views', path.join(__dirname, 'views')) //Dizendo que a pasta views agora está dentro de src (__dirname = diretório atual)

    app.engine('.hbs', exphbs({ //Config arquivos handlebars
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs'
    }))
    app.set('view engine', '.hbs') //Config motor das views


//Middlewares
    app.use(express.urlencoded({ extended: false })) //Ex: Dizer que quando usuario passar dados de form eu quero vêlos
    app.use(methodOverride('_method')) //Forms podem enviar outros tipos de metodos além de get e post
    app.use(session({ //Configs que permitem autenticar e salvar sessões
        // secret: 'mysecretapp',
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }))
    
    // Configs de passport
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(flash()) //Mensagens flash

//Variaveis Globais
    app.use((req, res, next)  => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        //Para ver mensagens de erro do passport (usado na autentição de login)
        res.locals.error = req.flash('error');

        res.locals.user = req.user || null;
        next();
    })

//Rotas
    app.use(require('./routes/index')) //Dizendo onde estão as rotas do servidor
    app.use(require('./routes/notas'))
    app.use(require('./routes/usuarios'))


//Arquivos estáticos
    app.use(express.static(path.join(__dirname, 'public'))) //Dizendo que pulic é uma pasta publica


//Servidor está escutando
    app.listen(app.get('port'), () => {
        console.log("Servidor na porta: ", app.get('port'))
    })