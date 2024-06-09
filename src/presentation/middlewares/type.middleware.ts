import { NextFunction, Request, Response } from "express";

export class TypeMiddleware {
  static validTypes(validTypes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      //const type = req.params.type; this can only be used if you place the middle ware in the router.post(x,[middleware], controller)
      const type = req.url.split("/").at(2) ?? "";
      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({ error: `Invalid type: ${type}, valid ones ${validTypes}` });
      }
      next();
    };
  }
}
