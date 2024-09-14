const express = require("express");
const app = express();
const { Server } = require("socket.io");

const orderRouter = require("./modules/order/index");

//server read value from clien by express.json()
//then send value from req.body to backend
app.use(express.json());

//req.parem & req.query server(express) default เพื่อรับค่าไว้ให้แล้ว

app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
app.use(express.static(__dirname + "/public"));

app.use("/order", orderRouter);

app.get("/", (req, res) => {
  res.render("index");
});

const app_server = app.listen(3000, () => {
  console.log("server is running at post 3000");
});

const io = new Server(app_server);

app.io = io;

io.on("connection", (socket) => {
  console.log(socket.id + "is connected");

  socket.on("disconnect", () => {
    console.log(socket.id + "is disconnected");
  });
});
