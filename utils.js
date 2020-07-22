const config = require('./config.json');

export const makeFullUrl = route => config.serverUri + route;

export default makeFullUrl;