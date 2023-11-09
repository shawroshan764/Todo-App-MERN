import { Request, Response } from "express";
const Tasks = require("../model/tasks");
const jwt = require("jsonwebtoken");
const User = require('../model/user');
const { validateTask } = require("../validation");



const addTask = async (req: Request, res: Response) => {
    const { taskName } = req.body;
    const { error } = validateTask(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const userId = loggedInUser(String(req.headers.authorization));
    try {
        const newTask = new Tasks({
            taskName,
            author: userId,
        });
        await newTask.save();
        await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } })
        res.status(200).json({
            message: 'Task created successfully.', newTask
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({ error: "Task creation failed." });
    }
}

const getAllTasks = async (req: Request, res: Response) => {
    try {
        // Get the user's ID from the token or wherever you store it
        const userId = loggedInUser(String(req.headers.authorization));

        // Find all posts that belong to the current user
        const posts = await Tasks.find({ author: userId });

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
const deleteTask = async (req: Request, res: Response) => {
    try {

        const userId = loggedInUser(String(req.headers.authorization));


        const { id } = req.params;
        const userTask = await Tasks.findOne({ _id: id, author: userId });

        if (!userTask) {
            return res.status(404).json({ message: 'Post not found or you do not have permission to delete it.' });
        }


        await Tasks.deleteOne({ _id: id });
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });

        return res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const loggedInUser = (authorization: string) => {
    let token, decode;
    if (authorization) {
        token = authorization.split(" ");
        decode = jwt.verify(token[1], process.env.JWT_SECRET_KEY);
    }
    return decode._id;
};


module.exports = {
    addTask,
    getAllTasks,
    deleteTask
};