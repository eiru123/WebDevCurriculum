const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const secret = 'notepad key';
const expiresIn = 60 * 60;

const auth = {
    signToken(userId) {
        return jwt.sign({userId}, secret, {expiresIn});
    },
    ensureAuth(headers) {
        const {authorization} = headers;
        
        if(!authorization) {
            throw Error('No Authorization headers');
        }

        try {
            return user = this.verify(authorization).userId;
        } catch (e) {
            console.log(e);
            throw new AuthenticationError('jwt token is expired');
        }   
    },
    verify (token) {
        return jwt.verify(token.replace(/^Bearer\s/, ''), secret);
    }
};

module.exports = auth;