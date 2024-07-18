// 5:25:28
const app = require('./app')
const mongoose = require('mongoose');
const connectDB = async ()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/ecom');
        console.log("Database Connected")
    }catch(error){
        console.log("Database is not Connected")
        console.log(error.message)
        process.exit(1);
    }
}

PORT = 4000;
app.listen(PORT,async ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
    await connectDB()
});
