import User from "../models/user.model";
import Middleware from "../configs/middleware.config";
import { NextFunction, Request, Response } from "express";

export class UserController {

  /**
   * Registers the user in the system and returns a token
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public register(req: Request, res: Response, next: NextFunction): void  {
    if (req.body.username && req.body.password) {

      User.findOne({ username: req.body.username })
        .then(user => {
          if (user && user.username) {
            res.status(409).json(req.body)
          } else {

            const user = new User();
            user.username = req.body.username;
            user.secure(req.body.password);

            user.save()
              .then(user => res.json({
                id: user.id,
                username: user.username,
                jwt: user.token()
              }))
              .catch(err => next(err))
          }
        })
        .catch(err => next(err));

    } else {
      res.status(422).json(req.body);
    }
  }

  /**
   * Logs in the user and returns a token
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public login(req: Request, res: Response, next: NextFunction): void {
    if(req.body.username && req.body.password) {
      User.findOne({ username: req.body.username })
        .then(user => {
          if (user && user.username) {
            const result = user.verify(req.body.password);
            if (result) {
              res.json({
                id: user.id,
                username: user.username,
                jwt: user.token()
              });
            } else {
              res.status(401).json(req.body);
            }
          } else {
            res.status(401).json(req.body);
          }
        })
        .catch(err => next(err));
    } else {
      res.status(400).json(req.body);
    }
  }

  /**
   * Modifies user data, it requires authorization header.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {void}
   */
  @Middleware
  public update(req: Request, res: Response, next: NextFunction): void {
    User.findById(req["payload"].id)
      .then(user => {
        if (
          (user && user.username) &&
          (req.body.username || req.body.password)
        ) {

          if (req.body.username) {
            user.username = req.body.username;
          }

          if (req.body.password) {
            user.secure = req.body.password;
          }

          user.save()
            .then(user => res.json({
              id: user.id,
              username: user.username,
              jwt: user.token()
            }))
            .catch(err => next(err));

        } else {
          res.status(422).json(req.body);
        }
      })
  }
}
