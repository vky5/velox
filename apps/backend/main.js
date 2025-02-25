const express = require("express");
const morgan = require("morgan");
const cors = require("cors");


// the error handler
const globalErrorHandler = require("./controllers/globalErrorHandler")



const app = express();


// to implement the cors restrictions
app.use(cors());


app.use(morgan());

app.use(globalErrorHandler);

module.exports =app;

