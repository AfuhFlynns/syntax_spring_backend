import { v4 } from "uuid";
const uuid = v4;
import fsPromises from "fs";
import fs from "fs";
import { format } from "date-fns";
import path from "path";
import { fileURLToPath } from "url";
import { request } from "http";

// //Setting up the path module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const requestLogger = async (req, message) => {
  const line = "========================================";
  try {
    const dateTime = format(new Date(), "yyyy:MM:dd:HH:mm:ss");
    const requestId = uuid();
    const logEventData = `${line}\nRequestId: ${requestId}\nDate: ${dateTime}\nOrigin: ${req.headers.host}\nUrl: ${req.url}\nMethod: ${req.method}\nMessage log: ${message}\n${line}\n\n`;
    !fs.existsSync(path.join(__dirname, "..", "..", "logs")) &&
      (await fsPromises.mkdir(path.join(__dirname, "..", "..", "logs")));
    await fsPromises.appendFile(
      path.join(
        __dirname,
        "..",
        "..",
        "logs",
        `${
          message.toLowerCase().includes("error")
            ? "errorLogger.txt"
            : "successLogger.txt"
        }`
      ),
      logEventData
    );
  } catch (error) {
    console.error(error.message);
  }
};

function logger(req, res, next) {
  const message = "Successful Request";
  requestLogger(req, message);
  next();
}

export default logger;
