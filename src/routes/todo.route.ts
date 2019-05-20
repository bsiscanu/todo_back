import * as jwt from "express-jwt";
import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";

export class TodoRoute {

  constructor(
    private router = Router(),
    private todoController = new TodoController(),
    private auth = jwt({secret: process.env.SECRET, userProperty: 'payload'})
  ) {

  }

  /**
   * Todo's routes
   *
   * @return {Router}
   */
  public trail(): Router {

    this.router.param("todo", this.todoController.todo);
    this.router.get("/", this.auth, this.todoController.list);
    this.router.post("/", this.auth, this.todoController.create);
    this.router.get("/:todo", this.auth, this.todoController.read);
    this.router.put("/:todo", this.auth, this.todoController.update);
    this.router.delete("/:todo", this.auth, this.todoController.delete);

    return this.router;
  }
}
