const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada', code: 401 });
    }
    const key = process.env.KEY;
    try {
        const decoded = jwt.verify(token, key);
        req.id = decoded.external;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = auth;