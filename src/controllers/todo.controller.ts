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
      .then(todo => {

        if (todo.project) {
          Project.update({ _id: todo.project }, { $addToSet: { todos: todo._id }}, { multi: false }, (err: Error) => {
            if (err) {
              next(err)
            } else{
              res.json(todo)
            }
          });
        } else {
          res.json(todo);
        }


      })
      .catch((err: Error) => next(err));
  }

  /**
   * Returns a selected by id
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
      .then(todo => {

        if (req["todo"].project) {
          Project.update({ },  { $pull: { todos: req["todo"]._id }}, { multi: true }, (err: Error) => {
            if (err) {
              next(err);
            } else {
              Project.update({ _id: req["todo"].project }, { $addToSet: { todos: req["todo"]._id }}, { multi: false }, (err: Error) =>
                err ? next(err) : res.json(todo)
              );
            }
          });
        } else {
          res.json(todo);
        }

      })
      .catch((err: Error) => next(err));
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
      .then(() => {

        if (req["todo"].project) {
          Project.update({ }, { $pull: { todos: req["todo"]._id }}, { multi: false }, (err: Error) => {
            if (err) {
              next(err)
            } else {
              res.json(req["todo"])
            }
          });
        } else {
          res.json(req["todo"])
        }
      })
      .catch((err: Error) => next(err));
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
//      .populate("project")
      .then(todos => res.json(todos))
      .catch((err: Error) => next(err));
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
//      .populate('project')
      .then(todo => {
        if (todo) {
          req["todo"] = todo;
          next()
        } else {
          next(new Error("Not Found"));
        }
      })
      .catch((err: Error) => next(err));
  }
}
