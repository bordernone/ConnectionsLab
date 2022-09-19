// Creating variables in global scope such that other functions can access it
let outputArea;
let inputArea;
let clearBtn;

let input;

window.onload = (event) => {
    // Referencing the elements
    outputArea = document.getElementById("output");
    inputArea = document.getElementById("input");
    clearBtn = document.getElementById("clear-btn");

    // Attach a input event listener to the input field
    inputArea.addEventListener("input", (event) => {
        input = event.target.value;
        resolve();
    });

    // Attach a click listener to the clear button
    clearBtn.addEventListener("click", () => {
        handleClear();
    });
};

// This will reset everything: clear input, clear output
function handleClear() {
    inputArea.value = "";
    input = "";
    outputArea.innerHTML = "";
}

// This function is responsible for generating the answer of the entered mathematical expression
function resolve() {
    try {
        let res = Function(`'use strict'; return (${input})`)(); // Probably the worst solution. Shouldn't be used in production environment. 
        outputArea.innerHTML = res;
    } catch (error) {
        outputArea.innerHTML = "0";
    }
}
