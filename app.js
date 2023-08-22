const https = require('https');
const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');

const routes = require('./routes/index');
const config = require('./config/config');
const {devlog} = require("./config/config");

const app = express();
const port = 80;

dotenv.config();
dotenv.config({ path: '.env.keys' });

// session
app.use(session({
    secret: "qweqwe",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'Lax', // Cross-site request 전송을 허용
    },
}));

// HTTPS
const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    ca: fs.readFileSync(process.env.CA_PATH)
};
const server = https.createServer(options, app);
devlog(`HTTPS certificate authority loaded.`);

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
devlog(`Middleware loaded.`);

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

server.listen(443, () => {
    devlog(`HTTPS listening on port ${port}`);
});

app.listen(port, () => {
    devlog(`HTTP listening on port ${port}`);
});

