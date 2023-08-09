const https = require('https');
const express = require('express');
const routes = require('./routes/index');
const fs = require('fs');

const app = express();
const port = 80;


// HTTPS
const options = {
    key: fs.readFileSync('./keys/private.pem'),
    cert: fs.readFileSync('./keys/public.pem')
};
const server = https.createServer(options, app);

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', routes);
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            message: err.message,
        },
    });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});