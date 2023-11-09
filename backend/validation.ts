import Joi from "joi";


// Define a Joi schema for user input validation
const userSchema = Joi.object({
  name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Function to validate user input against the schema
function validateUser(user: {
  name: string;
  email: string;
  password: string;
}) {
  return userSchema.validate(user);
}

// User's Tasks validations 
const UsertaskSchema = Joi.object({
  taskName: Joi.string().min(10).max(50),
})

function validateTask(post: {
  taskName: string,
}) {
  return UsertaskSchema.validate(post);
}

module.exports = {
  validateUser,
  validateTask
};




