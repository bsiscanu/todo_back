import * as path from "path";
import * as dotenv from "dotenv";
import * as express from "express";
import * as logger from "morgan";
import * as debug from "debug";
import * as mongoose from "mongoose";
import { ProjectRoute } from "./routes/project.route";
import { TodoRoute } from "./routes/todo.route";
import { UserRoute } from "./routes/user.route";

debug("todo:server");
const env = dotenv.config().parsed;
const app = express();

//middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB, { useMongoClient: true });

//routes
const todoRoute = new TodoRoute();
const userRoute = new UserRoute();
const groupRoute = new ProjectRoute();

app.use("/todos", todoRoute.trail());
app.use("/users", userRoute.trail());
app.use("/groups", groupRoute.trail());


// server
console.log(`Listening on ${env.PORT}`);
app.listen(env.PORT);
