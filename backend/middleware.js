const {JWT_SECRET} = require('./config');
const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Invalid or missing Authorization header');
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded JWT:', decoded);

        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Error verifying JWT:', err);
        return res.status(403).json({
            message: "Error"
        });
    }
};


module.exports = {
    authMiddleware
}