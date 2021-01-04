const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT,
    databaseURL: process.env.MONGO_URI
}