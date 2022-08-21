const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  // query is read only - accessing data
  // GET request
  Query: {
    me: async (parent, args, context) => {
      // context.user
      const userId = context.user._id;
      return User.findById(userId);
    },
  },

  // mutate means change - operations that will change something ie add, update, delete
  // CRUD + misc
  // POST PUT DELETE requests
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      console.log(token);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error("Wrong password!");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link },
      context
    ) => {
      if (!context.user) {
        throw new Error("Please login!");
      }
      const payload = {
        authors,
        description,
        bookId,
        image,
        link,
        title,
      };
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: payload } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
      // return User
    },
    removeBook: async (parent, { bookId }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("Could not find user!");
      }
      return updatedUser;
      // return User
    },
  },
};

module.exports = resolvers;
