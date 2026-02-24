const socket = io();

let username = "";

const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const enterBtn = document.getElementById("enterBtn");
const usernameInput = document.getElementById("usernameInput");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const userList = document.getElementById("userList");

enterBtn.addEventListener("click", () => {
    username = usernameInput.value.trim();
    if (username !== "") {
        socket.emit("join", username);
        loginDiv.style.display = "none";
        chatDiv.style.display = "block";
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit("chat message", input.value);
        input.value = "";
    }
});

socket.on("chat message", (data) => {
    addMessage(data);
});

socket.on("chat history", (history) => {
    messages.innerHTML = "";
    history.forEach(addMessage);
});

socket.on("users", (users) => {
    userList.innerHTML = "";
    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user;
        userList.appendChild(li);
    });
});

function addMessage(data) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${data.user}</strong> 
                  <small>${data.time}</small><br>
                  ${data.text}`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
}
