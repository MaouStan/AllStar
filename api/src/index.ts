import http from "http";
import { app } from "./app";

const port = 3500;
const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server is started");
});
