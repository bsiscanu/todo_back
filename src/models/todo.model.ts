import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Todo's Mongoose Model
 */
const schema = Schema({
  label: { type: String, required: true, lowercase: true },
  endDate: { type: Date, required: true },
  status: { type: Boolean, required: true, default: false },
  project: { type: Schema.Types.ObjectId, ref: "Project" }
});

export default mongoose.model("Todo", schema);
