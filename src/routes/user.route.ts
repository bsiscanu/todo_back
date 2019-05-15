import * as jwt from "express-jwt";
import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRoute {

  constructor(
    private router = Router(),
    private userController = new UserController(),
    private auth = jwt({secret: process.env.SECRET, userProperty: 'payload'})
  ) {

  }

  /**
   * User's routes
   *
   * @return {Router}
   */
  public trail(): Router {

    this.router.post("/register", this.userController.register);
    this.router.post("/login", this.userController.login);
    this.router.put("/update", this.auth, this.userController.update);

    return this.router;
  }
}
