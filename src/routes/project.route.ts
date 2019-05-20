import * as jwt from "express-jwt";
import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";

export class ProjectRoute {

  constructor(
    private router = Router(),
    private projectController = new ProjectController(),
    private auth = jwt({secret: process.env.SECRET, userProperty: 'payload'})
  ) {

  }

  /**
   * Project's routes
   *
   * @return {Router}
   */
  public trail(): Router {

    this.router.param("project", this.projectController.project);
    this.router.get("/", this.auth, this.projectController.list);
    this.router.post("/", this.auth, this.projectController.create);
    this.router.get("/:project", this.auth, this.projectController.read);
    this.router.put("/:project", this.auth, this.projectController.update);
    this.router.delete("/:project", this.auth, this.projectController.delete);

    return this.router;
  }
}
