import mongoose from "mongoose";
import config from "../config/index";

let Schema = mongoose.Schema;

let userActionSchema = mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
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

export default class UserApi {

  constructor()
  {
    this._url = config.mongoDb.url;
    this._settings = config.mongoDb.settings;
  }

  initialise = async () =>
  {
    await mongoose.connect(this._url, this._settings);

    this._db = mongoose.connection;

    this.User = mongoose.model("user", userSchema);
  };

  createUser = async (model) => {
    return await this.User.create(model);
  };

  findOne = async (query) => {
    return await this.User.findOne(query).exec();
  };

  userExists = async (model) => {
    let user = await this.findOne(model).exec();
    return user !== null && user !== undefined;
  };

}
