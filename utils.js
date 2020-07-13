const config = require('./config.json');

const makeFullUrl = route => config.serverUri + route;

export default makeFullUrl;