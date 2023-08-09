const express = require('express');
const app = express();
const port = 80;
const routes = require('./routes/index');

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
    console.log(`Example app listening on port ${port}`);
});