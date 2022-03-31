import express from "express";
import http from "http";
import "dotenv/config";
import connect from "./config/db.js";

connect();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const server = http.createServer(app)

server.listen(port, () => console.log(`Server listening on port ${port}`));