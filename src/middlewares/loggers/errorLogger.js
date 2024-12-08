import { requestLogger } from "./requestLogger.js";

function errorLogger(req, res, next) {
  const message = "Error Log Events";
  requestLogger(req, message);
  next();
}

export default errorLogger;
