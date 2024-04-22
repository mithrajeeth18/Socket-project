// Import required modules
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

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send current shared text to the newly connected client
  socket.emit("updateText", sharedText);

  // Listen for 'textChange' event
  socket.on("textChange", (text) => {
    // Update the shared text
    sharedText = text;
    // Broadcast the updated text to all connected clients except the sender
    socket.broadcast.emit("updateText", text);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
