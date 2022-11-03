import AuthController from "../controller/auth.controller.js";
const authController = new AuthController();

export default authController.authenticate.bind(authController);