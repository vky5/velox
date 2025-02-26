const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// Routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const assetRouter = require('./routes/assetRoutes');
const gpsRouter = require('./routes/gpsRoutes');

// the error handler
const globalErrorHandler = require("./controllers/globalErrorHandler")

const app = express();

// 1) Global Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));

// 2) Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/assets', assetRouter);
app.use('/api/v1/gps', gpsRouter);

// 3) Error handling - should be last
app.use(globalErrorHandler);

module.exports = app;
