let outputArea;
let inputArea;
let clearBtn;

let input;

window.onload = (event) => {
    outputArea = document.getElementById("output");
    inputArea = document.getElementById("input");
    clearBtn = document.getElementById("clear-btn");

    inputArea.addEventListener("input", (event) => {
        input = event.target.value;
        resolve();
    });

    clearBtn.addEventListener("onclick", () => {
        handleClear();
    });
};

function handleClear() {
    inputArea.value = "";
    input = "";
    outputArea.innerHTML = "";
}

function resolve() {
    try {
        let res = Function(`'use strict'; return (${input})`)(); // Probably the worst solution. Shouldn't be used in production environment. 
        outputArea.innerHTML = res;
    } catch (error) {
        outputArea.innerHTML = "0";
    }
}
