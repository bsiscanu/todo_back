import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";

export class TodoRoute {

  constructor(
    private router = Router(),
    private todoController = new TodoController()
  ) {

  }

  /**
   * Todo's routes
   *
   * @return {Router}
   */
  public trail(): Router {

    this.router.param("todo", this.todoController.todo);
    this.router.get("/", this.todoController.list);
    this.router.post("/", this.todoController.create);
    this.router.get("/:todo", this.todoController.read);
    this.router.put("/:todo", this.todoController.update);
    this.router.delete("/:todo", this.todoController.delete);

    return this.router;
  }
}
