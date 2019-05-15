import Todo from "../models/todo.model";
import Project from "../models/project.model";
import Middleware from "../configs/middleware.config";
import { NextFunction, Request, Response } from "express";

export class TodoController {

  /**
   * Creates a todo entity
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public create(req: Request, res: Response, next: NextFunction): void {
    const todo = new Todo(req.body);

    todo.save()
      .then(todo => res.json(todo))
      .catch(err => next(err));
  }

  /**
   * Returns a todo selected by id
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public read(req: Request, res: Response, next: NextFunction): void {
    res.json(req["todo"]);
  }

  /**
   * Modifies a todo selected by id
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public update(req: Request, res: Response, next: NextFunction): void {
    for(let key in req.body) {
      req["todo"][key] = req.body[key];
    }

    req["todo"].save()
      .then(todo => res.json(todo))
      .catch(err => next(err));
  }

  /**
   * Removes a todo found by id
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public delete(req: Request, res: Response, next: NextFunction): void {
    req["todo"].remove()
      .then(() =>
        Project.update({ }, { $pull: { todos: req["todo"].id } }, { multi: true })
      )
      .then(() => res.json(req["todo"]))
      .catch(err => next(err));
  }

  /**
   * Lists all todos
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public list(req: Request, res: Response, next: NextFunction): void {
    Todo.find()
      .then(todos => res.json(todos))
      .catch(err => next(err));
  }

  /**
   * Writes a todo to the Request object
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @param {string} id
   * @return {void}
   */
  @Middleware
  public todo(req: Request, res: Response, next: NextFunction, id: string): void {
    Todo.findById(id)
      .then(todo => {
        if (todo) {
          req["todo"] = todo;
          next()
        } else {
          next(new Error("Not Found"));
        }
      })
      .catch(err => next(err));
  }
}
