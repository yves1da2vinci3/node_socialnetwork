const ExpressLoader = require('./express');


module.exports = async (ExpressApp) => {    
    await ExpressLoader(ExpressApp);
    console.log('Express is initialized');
}