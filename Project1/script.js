let btn;
let inputElement;
let outputElement;

let wordsList = [];

// Reference to the DOM elements and attach on click event listener
window.onload = () => {
    btn = document.getElementById("generate-btn");
    inputElement = document.getElementById("word-input");
    outputElement = document.getElementById("output");

    btn.addEventListener("click", generateSimilarWords);
};

// Get input from the input field. If silent is false, it will alert user if the input field is empty; default is false.
const getInput = (silent = false) => {
    let text = inputElement.value;
    if (text !== undefined) {
        if (text.length === 0 && silent) {
            alert("Invalid input");
        }
        return text;
    } else {
        console.error("Input Element Not Recognized!");
    }
};

// Fetch related words from the API and process the returned json to generate array of words.
const generateSimilarWords = async (e) => {
    e.preventDefault();

    const queryObj = {
        ml: getInput(),
    };

    // turn javascript object to url friendly string
    const queryParam = new URLSearchParams(queryObj).toString(); // Note: not supported by internet explorer
    const API_URL = `https://api.datamuse.com/words?${queryParam}`;

    // Using Async and await
    try {
        let wordsData = await (await fetch(API_URL)).json();

        console.log(wordsData);

        // Converts an array of objects to array of words
        wordsList = wordsData.map((item) => {
            return item.word;
        });

        let p5_ = new p5(s);
    } catch (e) {
        console.log("Error: ", e);
    }
};

const s = (sketch) => {
    let canvas;
    let center;
    sketch.setup = () => {
        canvas = sketch.createCanvas(
            outputElement.clientWidth,
            outputElement.clientHeight
        );
        center = [
            outputElement.clientWidth / 2,
            outputElement.clientHeight / 2,
        ];
        canvas.parent("output");
    };

    sketch.draw = () => {
        (wordsList[0]) && drawBubble(center[0], center[1], 200, wordsList[0]);
        (wordsList[1]) && drawBubble(center[0] - 150, center[1] - 150, 150, wordsList[1]);
        (wordsList[2]) && drawBubble(center[0] - 150, center[1] + 150, 150, wordsList[2]);
        (wordsList[3]) && drawBubble(center[0] + 150, center[1] - 150, 120, wordsList[3]);
        (wordsList[4]) && drawBubble(center[0] + 150, center[1] + 150, 120, wordsList[4]);
        (wordsList[5]) && drawBubble(center[0] - 160, center[1], 110, wordsList[5]);
        (wordsList[6]) && drawBubble(center[0] + 160, center[1], 60, wordsList[6]);
        (wordsList[7]) && drawBubble(center[0], center[1] - 140, 60, wordsList[7]);
    };

    drawBubble = (x, y, r, word) => {
        // sketch.stroke(0);
        sketch.strokeWeight(0);
        sketch.fill("#9999ff");
        sketch.circle(x, y, r);

        sketch.fill("#ff9933");
        sketch.textSize(Math.floor((1.5 * r)/word.length));
        sketch.textFont("monospace")
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text(word, x, y);
    };
};
