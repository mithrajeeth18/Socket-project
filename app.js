const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const _ = require("lodash");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const textData = {};

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static("public"));

app.get("/:key?", (req, res) => {
  const key = req.params.key;

  if (!textData[key]) {
    textData[key] = "";
  }
  res.render("index", { text: textData[key], key });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("textChange", (data) => {
    const { key, newText } = data;

    textData[key] = newText;

    socket.broadcast.emit("updateText", { key, newText });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
