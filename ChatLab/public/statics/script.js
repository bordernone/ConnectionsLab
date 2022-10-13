let username = prompt("Enter username");
let input, outputArea;

const URLs = {
    GET: "/messages",
    SEND: "/message",
};

window.onload = () => {
    input = document.getElementById("input-field");
    outputArea = document.getElementById("output-area");

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(event);
        }
    });

    setInterval(getMessage, 1000);
};

const sendMessage = (e) => {
    let message = input.value;

    fetch(URLs.SEND, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, message }),
    })
        .then((res) => res.json())
        .then((res) => {
            input.value = "";
            displayMessages(res);
        });
};

const getMessage = () => {
    fetch(URLs.GET)
        .then((res) => res.json())
        .then((res) => displayMessages(res));
};

const displayMessages = (arr) => {
    const elements = arr.data.reduce((final, item) => {
        if (item.username === username) {
            return (
                final +
                `<div class="message my">
                    <span class="whitespace-msg" ></span>
                    <span class="msg">${item.message}</span>
                </div>`
            );
        } else {
            return (
                final +
                `<div class="message other">
                    <span class="msg">${item.message}</span>
                    <span class="whitespace-msg" ></span>
                </div>`
            );
        }
    }, "");

    outputArea.innerHTML = elements;
};
