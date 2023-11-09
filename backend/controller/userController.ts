import { Request, Response } from "express";
const User = require("../model/user");
const bcrypt = require("bcrypt");
const BlacklistedToken = require("../model/blackListTokens");
const { validateUser } = require("../validation");
const jwt = require("jsonwebtoken");

const signup = async (req: Request, res: Response) => {
    let { name, email, password } = req.body;
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const isEmailExists = await User.findOne({ email });
        if (isEmailExists) return res.status(401).json({ message: "Email already exists." });

        const saltRounds = 10;
        const hashPassword = bcrypt.hashSync(password, saltRounds);
        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });
        await newUser.save();
        return res.status(200).json({ message: "User registered successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Internal error" });

    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "User doesn't exists." });
        }
        // Check if the password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Create and sign a JWT token for authentication
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        res.setHeader("authorization", token);
        res.setHeader("Access-Control-Expose-Headers", "*");

        const isBlacklisted = await BlacklistedToken.exists({ token });

        if (isBlacklisted) {
            return res.status(401).json({ error: "Token is blacklisted. Login is not allowed." });
        }
        return res.status(200).json({ message: "Login successfull", token, user });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ error: "Login failed." });
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error in user logout:', error);
        return res.status(500).json({ error: 'Logout failed.' });
    }
};

module.exports = {
    signup,
    login,
    logout
};