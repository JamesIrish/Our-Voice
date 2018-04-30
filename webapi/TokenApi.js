import mongoose from "mongoose";
import config from "../config/index";

let Schema = mongoose.Schema;

let refreshTokenSchema = mongoose.Schema(
{
  userId: { type: Schema.Types.ObjectId, required: true },
  expires: { type: Date, required: true },
  refreshToken: { type: String, required: true }
}, { timestamps: true });

let passwordResetTokenSchema = mongoose.Schema(
{
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  expires: { type: Date, required: true },
  resetToken: {
    type: String,
    required: true,
    index: true
  }
}, { timestamps: true });

const RefreshToken = mongoose.model("refresh_token", refreshTokenSchema);
const ResetPasswordToken = mongoose.model("reset_password_token", passwordResetTokenSchema);

export default class TokenApi {

  static createRefreshToken = async (model) => {
    return await RefreshToken.create(model);
  };

  static createResetPasswordToken = async (model) => {
    return await ResetPasswordToken.create(model);
  };

  static findRefreshTokens = async (query) => {
    return await RefreshToken.find(query).exec();
  };

  static findOneResetPasswordToken = async (query) => {
    return await ResetPasswordToken.findOne(query).exec();
  };

}
