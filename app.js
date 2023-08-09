const https = require('https');
const express = require('express');
const routes = require('./routes/index');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
const port = 80;

dotenv.config();
dotenv.config({ path: '.env.keys' });

// HTTPS
const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    ca: fs.readFileSync(process.env.CA_PATH)
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

app.listen(port, () => {
    console.log(`HTTP listening on port ${port}`);
});

server.listen(443, () => {
    console.log(`HTTPS listening on port ${port}`);
});
