import { createServer } from "http";
import { ENV } from "./config";
import app from "./app";
import { registerService } from "./services";
import CRON from "./cron";
import RMQClientInstance from "./libs/RMQ/client";
import { handleTC } from "./utils";

const PORT = ENV.PORT;

const start = async () => {
  const server = createServer(app);

  server.listen(PORT, async () => {
    registerService();
    CRON.announceServiceExistance.start();
    console.log("Appointment server is running on port: ", PORT);
    const [_, error] = await handleTC.handleAsync(
      RMQClientInstance.initialize()
    );
    if (error)
      console.warn(error.message || "Error while initializing RMQ client"); 
  }); 
};

start();
