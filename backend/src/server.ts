import dotenv from "dotenv";
import dns from "node:dns";
dotenv.config();
import { app } from "./app.js";
import { connectDB, disConnectDB } from "./config/db.js";
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

const startServer = async () => {
  try {
    // db connection
    await connectDB();
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server Listening at PORT : ${PORT} 👌`);
    });
    //*  Gracefull shutdown
    let shuttingDown: boolean = false;
    const shutDown = async (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;
      console.log(`\n${signal} received. Shutting Down server ⏳`);
      //* Force exit after 10s if connections refuse to close

      const forceExit = setTimeout(() => {
        console.log("Forced Shutting Down due to timeout ⚠️");
        process.exit(1);
      }, 10000);
      //* Normal shuttdown
      server.close(async () => {
        clearTimeout(forceExit);
        // disconnect db
        await disConnectDB();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutDown("SIGINT"));
    process.on("SIGTERM", () => shutDown("SIGTERM"));
  } catch (err) {
    console.error("Error ⚠️ while starting Server", err);
    process.exit(1);
  }
};
startServer();
