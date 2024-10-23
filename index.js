require("dotenv").config();
const { PORT, OMISE_S_KEY } = process.env;
const express = require("express");
const app = express();
const { Server } = require("socket.io");

const orderRouter = require("./modules/order/index");

const omise = require("omise")({
  secretKey: OMISE_S_KEY,
  omiseVersion: "2019-05-29",
});

//server read value from client by express.json()
//then send value from req.body to backend
app.use(express.json());

//req.param & req.query server(express) default เพื่อรับค่าไว้ให้แล้ว

app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
app.use(express.static(__dirname + "/public"));

app.use("/order", orderRouter);

app.get("", (req, res) => {
  res.render("index");
});

app.get("/complete", (req, res) => {
  const { order_id } = req.query;
  res.send("Complete order =" + order_id);
});

app.post("/api/charge", async (req, res) => {
  const { nonce } = req.body;
  //token method (credit card)
  //source method
  const isToken = nonce.startsWith("tokn_");
  let data = {};

  const omiseCreateCharge = async (noucePayload) => {
    data = await omise.charges.create({
      ...req.body,
      ...noucePayload,
    });
  };

  if (isToken) {
    await omiseCreateCharge({ card: nonce });
  } else {
    await omiseCreateCharge({ source: nonce });
  }

  res.json(data);
});

app.get("/complete", (req, res) => {
  res.render("complete");
});

const app_server = app.listen(PORT, () => {
  console.log(`server is running at post ${PORT}`);
});

const io = new Server(app_server);

app.io = io;

io.on("connection", (socket) => {
  console.log(socket.id + " is connected");

  socket.on("disconnect", () => {
    console.log(socket.id + "is disconnected");
  });
});
