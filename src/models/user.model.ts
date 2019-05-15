import * as mongoose from "mongoose";
import { randomBytes, pbkdf2Sync } from "crypto";
import { sign } from "jsonwebtoken";

const Schema = mongoose.Schema;

/**
 * User's Mongoose Model
 */
const schema = Schema({
  username: { type: String, required: true, lowercase: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  lang: { type: String, required: false }
});

schema.methods.secure = function(password: string) {
  this.salt = randomBytes(16).toString('hex');
  this.hash = pbkdf2Sync(password.toString(), this.salt, 10, 64, "sha512").toString('hex');
};

schema.methods.verify = function(password: string) {
  const inputHash = pbkdf2Sync(password.toString(), this.salt, 10, 64, "sha512").toString('hex');
  return this.hash === inputHash;
};

schema.methods.token = function() {
  const today = new Date();
  const expire = new Date();

  expire.setDate(today.getDate() + 7);

  const payload = {
    id: this.id,
    name: this.name,
    exp: expire.getTime() / 1000
  };

  return sign(payload, process.env.SECRET)
};

export default mongoose.model("User", schema);
