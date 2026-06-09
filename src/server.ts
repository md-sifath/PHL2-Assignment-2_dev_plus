import app from "./app";
import config from "./config";
import { initDB } from "./db/index";

const serverStart = async () => {
  await initDB();

  app.listen(config.port, () => {
    console.log(`server is running at port ${config.port}`);
  });
};

serverStart();
