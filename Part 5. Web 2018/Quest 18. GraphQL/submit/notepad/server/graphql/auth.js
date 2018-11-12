const jwt = require('jsonwebtoken');
const secret = 'notepad key';
const expiresIn = 60 * 60;

const auth = {
    signToken(userId) {
        return jwt.sign({userId}, secret, {expiresIn});
    },
    ensureAuth(headers) {
        const {authorization} = headers;
        if(!authorization) {
            res.status(401);
            throw Error('No Authorization headers');
        }

        try {
            return user = this.verify(authorization).userId;
        } catch (e) {
            res.status(401);
            throw e;
        }   
    },
    verify (token) {
        return jwt.verify(token.replace(/^Bearer\s/, ''), secret);
    }
};

module.exports = auth;