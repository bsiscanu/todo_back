import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Project's Mongoose Model
 */
const schema = Schema({
  name: { type: String, required: true, lowercase: true, unique: true },
  todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }]
});

export default mongoose.model("Project", schema);
