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

/** ----       TODO: Beyond to remove         ---- **/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEADERS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Authorization');
  next();
});
/** ----       TODO: Above to remove          ---- **/

app.use("/todos", todoRoute.trail());
app.use("/users", userRoute.trail());
app.use("/projects", groupRoute.trail());


// server
console.log(`Listening on ${env.PORT}`);
app.listen(env.PORT);
