import mongoose from "mongoose";

let userActionSchema = mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

let userSchema = mongoose.Schema({
  isActiveDirectory: {
    type: Boolean,
    default: false,
    required: true,
    index: true
  },
  domain: String,
  sid: { type: String, index: true },
  username: String,
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    trim: true
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  displayName: { type: String, required: true, trim: true },
  actions: [userActionSchema],
  roles: [],
  password: String
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export default class UserApi {

  static createUser = async (model) => {
    return await User.create(model);
  };

  static findOne = async (query) => {
    return await User.findOne(query).exec();
  };

  static userExists = async (model) => {
    let user = await UserApi.findOne(model).exec();
    return user !== null && user !== undefined;
  };

}
