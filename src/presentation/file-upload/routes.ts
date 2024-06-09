import { Router } from "express";
import { FileUploadService } from "../services";
import { FileUploadController } from "./controller";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new FileUploadController(new FileUploadService());

    router.use(FileUploadMiddleware.containFiles);
    router.use(TypeMiddleware.validTypes(["users", "categories", "products"]));
    // Definir las rutas
    router.post("/single/:type", controller.uploadFile);
    router.post("/multiple/:type", controller.uploadMultipleFile);

    return router;
  }
}
