const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

// Initialize Express app and create a server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Set up view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Shared state to store the text
let sharedText = "";

// Render index.ejs template
app.get("/", (req, res) => {
  res.render("index", { sharedText });
});

io.on("connection", (socket) => {
  socket.emit("updateText", sharedText);

  socket.on("textChange", (text) => {
    sharedText = text;
    socket.broadcast.emit("updateText", text);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
