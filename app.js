const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const reviewsRouter = require("./routes/reviews");
const shopsRouter = require("./routes/shops");
const { sequelize } = require("./models");
const cors = require("cors");
const fs = require("fs");

const app = express();

sequelize
  .sync()
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch(console.error);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cookieParser(process.env.COOKIE_SECRET, { sameSite: "none", secure: true })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/uploads/:filename", (req, res) => {
  console.log(req.params);
  fs.readFile("/uploads/" + req.params.filename, (err, data) => {
    console.log(data);
    res.writeHead(200, {
      "Content-Type": `text/html`,
    });
    res.end(data);
  });
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/reviews", reviewsRouter);
app.use("/shops", shopsRouter);

module.exports = app;
