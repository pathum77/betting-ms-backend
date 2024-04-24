require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/mongo-db')
const { CONSTANTS } = require('./utils/constants');

const UserRoute = require('./routes/users');
const DrawRoute = require('./routes/draws');
const SettingsRoute = require('./routes/settings');
const BetRoute = require('./routes/bets');
const resultRoute = require('./routes/results');

const app = express();
app.use(express.json());
app.use(cors());
connectDatabase();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/users', UserRoute);
app.use('/draws', DrawRoute);
app.use('/settings', SettingsRoute);
app.use('/bets', BetRoute);
app.use('/results', resultRoute);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

app.listen(CONSTANTS.PORT, () => {
    console.log(`running on port ${CONSTANTS.PORT}`);
});