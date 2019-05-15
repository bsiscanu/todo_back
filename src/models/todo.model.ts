import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Todo's Mongoose Model
 */
const schema = Schema({
  label: { type: String, required: true, lowercase: true },
  endData: { type: Date, required: true },
  status: { type: Boolean, required: true, default: false }
});

export default mongoose.model("Todo", schema);
