const dotenv = require("dotenv");

const app = require("./main");
const mongoose = require("mongoose");

dotenv.config({path: './config.env'});

const DB = process.env.DB_URL;

mongoose.connect(DB).then(con=>{
    console.log("DB connected successfully")
}).catch(err=>{
    console.log(err);
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})



