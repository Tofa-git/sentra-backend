const jwt = require('jsonwebtoken')
const db = require('../config/sequelize');
const userModel = db.users;

const constants = require('../config/constants');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findOne({ 
            attributes: ['id','firstName', 'lastName', 'email'],
            where: { email: decodedToken.email }
        })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ message: 'Please authenticate.' , data:null })
    }
}

module.exports = auth