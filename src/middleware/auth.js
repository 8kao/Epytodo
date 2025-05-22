const jwt = require('jsonwebtoken');
const no_token_error = {"msg": "No token, authorization denied"};
const bad_token_error = {"msg": "Token is not valid"};

function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).send(no_token_error);
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send(bad_token_error);
    }
}

module.exports = {
    verifyToken
};
