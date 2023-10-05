function devlog(message) {
    if (process.env.NODE_ENV === 'dev') console.log(message);
}

function errorlog(error) {
    if (process.env.NODE_ENV === 'dev') console.error(error);
}

module.exports = {
    devlog,
    errorlog,
};