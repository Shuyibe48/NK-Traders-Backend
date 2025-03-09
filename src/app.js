import express from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorhandler.js";
import notFound from "./app/middlewares/notFound.js";
import router from "./app/routes/index.js";
import cookieParser from "cookie-parser";
const app = express();

// parser
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nk-traders.vercel.app"
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// application routes
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});

// wrong rout error handler
app.all("*", notFound);

// global error handler
app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;