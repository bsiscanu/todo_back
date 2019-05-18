import Todo from "../models/todo.model";
import Project from "../models/project.model";
import { NextFunction, Request, Response } from "express";
import Middleware from "../configs/middleware.config";

export class ProjectController {

  /**
   * Creates a project entity
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public create(req: Request, res: Response, next: NextFunction): void {
    const project = new Project(req.body);

    Project.update({ }, { $pull: { todos: { $in: project.todos }}}, { multi: true }, (err: Error) => {
      if (err) {
        next(err);
      } else {

        project.save()
          .then(project => {

            if (Array.isArray(project.todos) && project.todos.length) {
              Todo.update({ _id: { $in: project.todos }}, { project: project._id }, { multi: true}, (err: Error) =>{
                if (err) {
                  next(err);
                } else {
                  res.json(project);
                }
              });
            } else {
              res.json(project)
            }

          })
          .catch((err: Error) => next(err));

      }
    })



  }

  /**
   * Returns a project selected by id
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public read(req: Request, res: Response, next: NextFunction): void {
    res.json(req["project"]);
  }

  /**
   * Modifies a project selected by id
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public update(req: Request, res: Response, next: NextFunction): void {
    for(let key in req.body) {
      req["project"][key] = req.body[key];
    }

    Project.update({ }, { $pull: { todos: { $in: req["project"].todos }}}, { multi: true }, (err: Error) => {
      if (err) {
        next(err);
      } else {
        req["project"].save()
          .then(project => {

            if (Array.isArray(project.todos) && project.todos.length) {
              Todo.update({ project: project.id }, { $unset: { project: '' }}, { multi: true }, (err: Error) => {
                if (err) {
                  next(err);
                } else {
                  Todo.update({ _id: { $in: project.todos }}, { project: project._id }, { multi: true }, (err: Error) =>
                    err ? next(err) : res.json(project)
                  )
                }
              });
            } else {
              res.json(project);
            }

          })
          .catch((err: Error) => next(err));
      }
    })

  }

  /**
   * Removes a project found by id
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public delete(req: Request, res: Response, next: NextFunction): void {
    req["project"].remove()
      .then(() => {

        if (Array.isArray(req["project"].todos) && req["project"].todos.length) {
          Todo.update({ project: req["project"]._id }, { $unset: { project: '' }}, { multi: true }, (err: Error) => {
            if (err) {
              next(err);
            } else {
              res.json(req["project"]);
            }
          });
        } else {
          res.json(req["project"]);
        }
      })
      .catch((err: Error) => next(err));
  }

  /**
   * Lists all projects
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public list(req: Request, res: Response, next: NextFunction): void {
    Project.find()
      .populate("todos")
      .then(projects => res.json(projects))
      .catch((err: Error) => next(err));
  }

  /**
   * Writes a project to the Request object
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @param {string} id
   * @return {void}
   */
  @Middleware
  public project(req: Request, res: Response, next: NextFunction, id: string): void {
    Project.findById(id)
      .populate("todos")
      .then(project => {
        if (project) {
          req["project"] = project;
          next()
        } else {
          next(new Error("Not Found"));
        }
      })
      .catch((err: Error) => next(err));
  }
}
