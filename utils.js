const config = require('./config.json');

export const makeFullUrl = route => config.serverUri + route;
export const avatarUrl = makeFullUrl(config.avatarUrl);
export const sortByCreatedAt = (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt);
export const closeDialogDelayed = onClose => setTimeout(onClose, 1000);