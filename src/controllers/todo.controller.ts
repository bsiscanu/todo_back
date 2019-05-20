import Todo from "../models/todo.model";
import Project from "../models/project.model";
import User from "../models/user.model";
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

    Todo.create(req.body).then(todo => {

      const promises = [];

      if (todo.project) {
        promises.push(
          Project.update({ _id: todo.project }, { $addToSet: { todos: todo._id }}, { multi: false })
        );
      }

      if (todo.user) {
        promises.push(
          User.update({ _id: todo.user }, { $addToSet: { todos: todo._id }}, { multi: true })
        );
      }

      if (promises.length) {
        return Promise.all(promises) && todo
      } else {
        return todo;
      }

    })
      .then(todo =>  res.json(todo))
      .catch(err => next(err));
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

    req["todo"].save().then(todo => {
      const promises = [];

      if (req["todo"].user) {
        promises.push(
          User.update({ _id: { $ne: req["todo"].user } }, { $pull: { todos: req["todo"]._id }}, { multi: true })
            .then(() =>
              User.update({ _id: req["todo"].user }, { $addToSet: { todos: req["todo"]._id } }, { multi: false })
            )
        )
      }

      if (req["todo"].project) {
        promises.push(
          Project.update({ _id: { $ne: req["todo"].project } },  { $pull: { todos: req["todo"]._id }}, { multi: true })
            .then(() =>
              Project.update({ _id: req["todo"].project }, { $addToSet: { todos: req["todo"]._id }}, { multi: false })
            )
        );
      }

      if (promises.length) {
        return Promise.all(promises) && todo;
      } else {
        return todo;
      }

    })
      .then(todo => res.json(todo))
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

    Promise.all([
      req["todo"].remove(),
      Project.update({ _id: req["todo"].project }, { $pull: { todos: req["todo"]._id }}, { multi: false }),
      User.update({ _id: req["todo"].user }, { $pull: { todos: req["todo"]._id }}, { multi: false })
    ])
      .then(() => res.json(req["todo"]))
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
      .populate("project")
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
     .populate('project')
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
