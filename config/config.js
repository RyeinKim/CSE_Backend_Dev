const dev = process.env.NODE_ENV || 'dev';

function devlog(message) {
    if (dev === 'dev') console.log(message);
}

module.exports = {
    dev,
    devlog
};