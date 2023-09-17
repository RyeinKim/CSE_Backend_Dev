const dev = process.env.NODE_ENV || 'dev';

function devlog(message) {
    if (dev === 'dev') console.log(message);
}

function errorlog(error) {
    if (dev === 'dev') console.error(error);
}

module.exports = {
    dev,
    devlog,
    errorlog,
};