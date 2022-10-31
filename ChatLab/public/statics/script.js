let username = prompt("Enter username");
let input, outputArea;

let socket = io();

window.onload = () => {
    input = document.getElementById("input-field");
    outputArea = document.getElementById("output-area");

    // Handle enter press when typing message
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(event);
        }
    });
};

socket.on("connect", () => {
    console.log("Connected!");
    scrollToBottom();
});

socket.on("disconnect", () => {
    console.log("Disconnected");
});

socket.on("new_message", (data) => {
    displayMessages(data); // display messages

    scrollToBottom(); // Scroll to bottom when the message new message is loaded
});

// Server can send error when something goes wrong. So warn user in such cases
socket.on("error", () => {
    alert("Something went wrong with the server. Please try again!");
})

const sendMessage = (e) => {
    let message = input.value;

    socket.emit("new_message", { username, message });
    input.value = "";
};

const displayMessages = (arr) => {
    let lastUsername = undefined;
    const elements = arr.data.reduce((final, item) => {
        let elem = "";
        if (item.username === username) {
            if (item.username === lastUsername) {
                elem =
                    final +
                    `<div class="message my">
                    <span class="whitespace-msg" ></span>
                    <div class="msg">
                        <span class="user-msg">${item.message}</span>
                    </div>
                </div>`;
            } else {
                elem =
                    final +
                    `<div class="message my">
                    <span class="whitespace-msg" ></span>
                    <div class="msg">
                        <span class="username">${item.username}</span>
                        <span class="user-msg">${item.message}</span>
                    </div>
                </div>`;
            }
        } else {
            if (item.username === lastUsername) {
                elem =
                    final +
                    `<div class="message other">
                    <div class="msg">
                        <span class="user-msg">${item.message}</span>
                    </div>
                    <span class="whitespace-msg" ></span>
                </div>`;
            } else {
                elem =
                    final +
                    `<div class="message other">
                    <div class="msg">
                        <span class="user-msg">${item.message}</span>
                        <span class="username">${item.username}</span>
                    </div>
                    <span class="whitespace-msg" ></span>
                </div>`;
            }
        }
        lastUsername = item.username;
        return elem;
    }, "");

    outputArea.innerHTML = elements;
};

const scrollToBottom = () => {
    setTimeout(() => {
        outputArea.scroll({
            top: outputArea.scrollHeight + 100,
            behavior: "smooth",
        });
    }, 100);
};
