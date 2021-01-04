const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
   try {
       const connect =  await mongoose.connect(process.env.MONGO_URI,{
           useUnifiedTopology :true,
           useCreateIndex:true,
           useNewUrlParser:true
       })
       console.log(` ${connect.connection.host}`)
   } catch(error){
       console.log(`error is :${error.message}`);
   }
}
 module.exports = connectDB;