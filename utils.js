const config = require('./config.json');

export const makeFullUrl = route => config.serverUri + route;
export const avatarUrl = makeFullUrl(config.avatarUrl);
export const dummyToUser = (dummy) => {
    return ({
        _id: dummy._id,
        name: dummy.name,
        email: 'dummy@dummy.com',
        photoUrl: avatarUrl,
        firstName: '',
        lastName: ''
    })
}