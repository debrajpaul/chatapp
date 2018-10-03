// Make connection
const socket = io.connect("http://localhost:4000");

//query
let message = document.getElementById("message"),
    handle = document.getElementById("handle"),
    btn = document.getElementById("send"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback");

// emit events
btn.addEventListener("click", () => {
    socket.emit("chat", {
        message: message.value,
        handle: handle.value
    });
});

message.addEventListener("keypress", () => {
    socket.emit("typing", handle.value);
});

// Listen for events
socket.on("chat", data => {
    feedback.innerHTML = "";
    output.innerHTML += `<p><strong>${data.handle}: </strong>${
        data.message
    }</p>`;
});

socket.on("typing", () => {
    feedback.innerHTML = `<p><em>${data} is typing a message....</em></p>`;
});
