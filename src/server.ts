import { createServer } from "http";
import { ENV } from "./config";
import app from "./app";

const server = createServer(app);

const PORT = ENV.PORT;

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
