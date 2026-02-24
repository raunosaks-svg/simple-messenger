const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};
let messages = [];

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join", (username) => {
        users[socket.id] = username;

        io.emit("users", Object.values(users));
        socket.emit("chat history", messages);
    });

    socket.on("chat message", (data) => {
        const messageData = {
            user: users[socket.id],
            text: data,
            time: new Date().toLocaleTimeString()
        };

        messages.push(messageData);

        io.emit("chat message", messageData);
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("users", Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
