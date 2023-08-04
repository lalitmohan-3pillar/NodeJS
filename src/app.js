const express = require('express');
// const exphbs  = require('express-handlebars');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4202;
const dbconnect = require('../dbConnection/dbconnect');
const hbs = require('hbs');
const middleware = require('../middleware/errorHandler');
const session = require('express-session')
var flash = require('connect-flash');
const { validateToken } = require('../middleware/validateTokenHandler');
const { gethome } = require('./controllers/homeController');
// const helper = require('./helper');

dbconnect();




app.use(flash());
app.use(session({
    secret:'Assessment application',
    resave:true,
    saveUninitialized:true
}))


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(middleware);

app.use('/static',express.static('public'))

// app.engine('handlebars', exphbs({
//     helpers: helper,
//   }));

app.set('view engine','hbs');
app.set('views','views')

//app.get(process.env.PREFIXPATH,validateToken,gethome);
hbs.registerPartials('views/partials');

//app.use(validateToken);
//Set the Routes path
app.use(process.env.PREFIXPATH,require('../src/routes/mainRoutes'));


app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
});
