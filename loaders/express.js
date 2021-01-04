const express = require('express');
const bodyParser = require('body-parser');
const corse = require('cors');
const session =require('express-session')
const MongosStore= require('connect-mongodb-session')(session)
const store_session = new MongosStore ({
    uri: process.env.MONGO_URI,
    collection :'sessions'
})
module.exports = async (app) => {
    app.use(
        session({
          secret: 'my secret',
          resave: false,
          saveUninitialized: false,
          store: store_session
        }));
    
    app = express();
    
    app.use(corse());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : false }));
    
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });
    return app;
}