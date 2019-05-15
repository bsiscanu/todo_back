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

    project.save()
      .then(project => res.json(project))
      .catch(err => next(err));
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

    req["project"].save()
      .then(project => res.json(project))
      .catch(err => next(err));
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
      .then(() => res.json(req["project"]))
      .catch(err => next(err));
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
      .catch(err => next(err));
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
      .catch(err => next(err));
  }
}
