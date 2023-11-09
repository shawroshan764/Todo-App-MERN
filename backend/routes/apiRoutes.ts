const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controller/userController");
const { verifyToken, verifySession } = require("../middleware/auth");
const { addTask, getAllTasks, deleteTask } = require("../controller/taskController");

// Authentication & Authorization Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", [verifyToken], logout);

// User's Tasks
router.post("/addtask", [verifyToken], addTask);
router.get("/getalltasks", [verifyToken], getAllTasks);
router.delete("/deleteTask/:id", [verifyToken], deleteTask);



// Verify Session
router.get("/verifySession", verifySession);
module.exports = router;