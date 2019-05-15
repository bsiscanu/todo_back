import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";

export class ProjectRoute {

  constructor(
    private router = Router(),
    private projectController = new ProjectController()
  ) {

  }

  /**
   * Project's routes
   *
   * @return {Router}
   */
  public trail(): Router {

    this.router.param("project", this.projectController.project);
    this.router.get("/", this.projectController.list);
    this.router.post("/", this.projectController.create);
    this.router.get("/:project", this.projectController.read);
    this.router.put("/:project", this.projectController.update);
    this.router.delete("/:project", this.projectController.delete);

    return this.router;
  }
}
