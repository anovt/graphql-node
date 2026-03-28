const User = require("../models/User");
const Todo = require("../models/Todo");
const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");
const { GraphQLUpload } = require("graphql-upload-minimal");




const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    users: async () => await User.find(),
    todos: async () => await Todo.find(),
    todosByUser: async (_, { userId }) => await Todo.find({ userId }),
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already registered");

      const user = new User({ name, email, password });
      await user.save();
      console.log("User registered:", user.toJSON());
      return {
        data: user,
        message: "User registered successfully",
      };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid password");

      const token = signToken(user);
      return { user, token };
    },
  

    createTodo: async (_, { title, userId }, context) => {
      if (!context.user)  throw new AuthError("Invalid token or expired", 401);
      

      const todo = new Todo({ title, completed: false, userId: context.user.id });
      return todo.save();
    },

    toggleTodo: async (_, { id }) => {
      const todo = await Todo.findById(id).exec();
      todo.completed = !todo.completed;
      return todo.save();
    },
  },

  User: {
    todos: (parent) => Todo.find({ userId: parent.id }).exec(),
  },

  Todo: {
    user: (parent) => User.findById(parent.userId).exec(),
  },
};
