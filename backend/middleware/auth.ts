import { Response, Request, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const BlacklistedToken = require('../model/blackListTokens');



const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    let payload = req.headers.authorization;

    if (!payload) {
        return res.status(401).json({ message: 'No token provided..' });
    }
    let token = payload.split(" ");
    if (token.length != 2) {
        return res.status(401).json({ message: 'Not a valid format' });
    }

    const actualToken = token[1];
    const formattedToken = `Bearer ${actualToken}`;

    const isBlacklisted = await BlacklistedToken.exists({ token: formattedToken });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted.' });
    }

    try {
        let data = jwt.verify(token[1], process.env.JWT_SECRET_KEY);
        let exp = new Date(data.exp);
        if (exp >= new Date()) {
            return res.status(401).json({ message: 'Token expired' });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Not a valid token." })

    }
}

const verifySession = async (req: Request, res: Response, next: NextFunction) => {
    let payload = req.headers.authorization;
    if (!payload) {
        return res.status(401).json({ message: 'No token provided..' });
    }
    let token = payload.split(" ");
    if (token.length != 2) {
        return res.status(401).json({ message: 'Not a valid format' });
    }
    try {
        let data = jwt.verify(token[1], process.env.JWT_SECRET_KEY);
        let exp = new Date(data.exp);
        if (exp >= new Date()) {
            return res.status(401).json({ message: 'Token expired' });
        }
        const user = await User.findOne({ _id: data._id }).select('-password').populate('tasks');
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Not a valid token." })

    }
}


const checkTokenBlacklist = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await BlacklistedToken.exists({ token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted.' });
    }

    // Token is valid, proceed to the next middleware or route
    next();
};


exports.verifyToken = verifyToken;
exports.checkTokenBlacklist = checkTokenBlacklist;
exports.verifySession = verifySession;