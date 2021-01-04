const loaders = require('./loaders/index');
const db = require('./config/db');
const express = require('express');
const authRoutes= require('./api/Auth/Router');
const postRoutes =require('./api/Posts/Router');
const port = process.env.PORT
async function startServer() {
    const app = express();
    await loaders(app);
    db()
    app.use('/auth',authRoutes);
    app.use('',postRoutes);
    app.listen(port, (err)=>{
        if (err) {
            console.log(err);
        }
        console.log( `Your server is ready ${port}` );
        
    })
}

startServer();