const https = require('https');
const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');
const MySQLStore = require('express-mysql-session')(session);
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes/index');
const {devlog} = require("./config/config");

const app = express();
const port = 80;

dotenv.config();
dotenv.config({ path: '.env.keys' });

app.use(cors({
    origin: 'http://49.247.43.150:3000',
    credentials: true,
}));
devlog(`CORS loaded.`);

devlog(`CORS loaded.`);

// Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CSE Community API with Swagger', // API의 제목을 입력합니다.
            version: '1.0.0', // API의 버전 정보를 입력합니다.
            description: 'CSE Community Back-end API', // API에 대한 간단한 설명을 추가합니다.
        },
        servers: [
            {
                url: 'http://49.247.43.150:80', // API가 호스팅될 서버의 URL을 입력합니다.
            },
        ],
    },
    apis: ['./routes/*.js'], // Swagger 문서를 생성하려는 라우트 파일의 경로를 배열로 입력합니다.
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// session
const sessionStoreOptions = {
    host: process.env.SESSION_DB_HOST,
    user: process.env.SESSION_DB_USER,
    password: process.env.SESSION_DB_PASSWORD,
    database: process.env.SESSION_DB_DATABASE,
    createDatabaseTable: true,
    table: 'session',
};

const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(session({
    secret: "qweqwe",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 1, // 1시간
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

// Routes
app.use('/', routes);
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

/*app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            message: err.message,
        },
    });
});*/

/*server.listen(443, () => {
    devlog(`HTTPS listening on port 443`);
});*/

app.listen(port, '0.0.0.0', () => {
    devlog(`HTTP listening on port ${port}`);
});

/*

 */