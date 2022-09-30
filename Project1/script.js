let btn;
let inputElement;
let outputElement;
let p5Instance;

let wordsList = [];

// Reference to the DOM elements and attach on click event listener
window.onload = () => {
    btn = document.getElementById("generate-btn");
    inputElement = document.getElementById("word-input");
    outputElement = document.getElementById("output");

    btn.addEventListener("click", (e) => {
        generateSimilarWords(e, getInput());
    });
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
const generateSimilarWords = async (e, input) => {
    if (e) {
        e.preventDefault();
    }

    const queryObj = {
        ml: input,
    };

    // turn javascript object to url friendly string
    const queryParam = new URLSearchParams(queryObj).toString(); // Note: not supported by internet explorer
    const API_URL = `https://api.datamuse.com/words?${queryParam}`;

    // Using Async and await
    try {
        let wordsData = await (await fetch(API_URL)).json();

        // Converts an array of objects to array of words
        wordsList = wordsData.map((item) => {
            return item.word;
        });

        // check if there is already an instance of p5. if not, create a new
        if (!p5Instance) {
            p5Instance = new p5(s);
        }
    } catch (e) {
        console.log("Error: ", e);
    }
};

// This function handles everything related to P5js setup and canvas
const s = (sketch) => {
    let canvas; 
    let center; // stores the center of the canvas

    // stores all the bubbles (pre-set)
    let allBubbles = [];
    let lastWordsList = []; // this is a helper list which is used to check if the word list has changed or not

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
        // Reinitialize the bubbles only if the word list has changed
        if (hasWordsListChanged()) {
            initializeBubbles();
            lastWordsList = [...wordsList];
        }
        // clears the canvas every time. This allows for a transparent background
        sketch.clear();

        // Every bubble has a draw function which draws the bubble based on it's lifecycle
        for (const [index, bubble] of allBubbles.entries()) {
            bubble.draw(wordsList[index]);
        }
    };

    // Checks which bubble is clicked and calls the "onClick" function of that bubble
    sketch.mouseClicked = () => {
        for (const bubble of allBubbles) {
            if (bubble.clicked(sketch.mouseX, sketch.mouseY)) bubble.onClick();
        }
        return false;
    };

    // Initializes the bubbles with respective radius and position
    initializeBubbles = () => {
        allBubbles = [];

        let bubblesLocation = [
            [center[0], center[1], 200],
            [center[0] - 150, center[1] - 150, 150],
            [center[0] - 150, center[1] + 150, 150],
            [center[0] + 150, center[1] - 150, 120],
            [center[0] + 150, center[1] + 150, 120],
            [center[0] - 160, center[1], 110],
            [center[0] + 160, center[1], 60],
            [center[0], center[1] - 140, 60],
        ];

        for (let i = 0; i < 8; i++) {
            let x = bubblesLocation[i][0];
            let y = bubblesLocation[i][1];
            let r = bubblesLocation[i][2];
            let temp = new Bubble(sketch, x, y, r);
            allBubbles.push(temp);
        }
    };

    // Auxuliary function that checks if the word list has changed.
    hasWordsListChanged = () => {
        // This is a naive approach but it works in my case since the list is composed of strings.
        return JSON.stringify(wordsList) !== JSON.stringify(lastWordsList);
    };
};

class Bubble {
    // the constructor sets the x, y, diameter and the word for the bubble. it also initializes the bubble's lifecycle to null
    constructor(s, x, y, diameter, word = null) {
        this.sketch = s;

        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.word = word;

        this.colors = new Colors();
        this.color = this.colors.generateRandomColor();

        this.currentDiameter = 0;

        this.lifeCycle = "null";
    }

    // This function decides whether to grow, shrink, or print the max bubble size
    draw(word = this.word) {
        if (word != this.word) this.word = word;
        if (this.lifeCycle === "null") this.grow();
        if (this.lifeCycle === "live") this.live();
        if (this.lifeCycle === "dying") this.shrink();
    }

    // This function creates the "grow" animation for the bubble
    async grow() {
        this.sketch.strokeWeight(0);
        let diameter = Math.min(this.currentDiameter, this.diameter); 
        this.sketch.fill(this.color);
        this.sketch.circle(this.x, this.y, diameter);

        this.sketch.fill(
            this.colors.textColor(this.color[0], this.color[1], this.color[2])
        );
        let textSize = Math.floor((1.5 * diameter) / this.word.length);
        if (textSize !== 0) {
            this.sketch.textSize(
                Math.floor((1.5 * diameter) / this.word.length)
            );
            this.sketch.textFont("monospace");
            this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
            this.sketch.text(this.word, this.x, this.y);
        }

        this.currentDiameter += 3;
        if (diameter === this.diameter) {
            this.lifeCycle = "live";
        }
    }

    // This function prints the max sized bubble
    live() {
        this.sketch.strokeWeight(0);
        this.sketch.fill(this.color);
        this.sketch.circle(this.x, this.y, this.diameter);

        this.sketch.fill(
            this.colors.textColor(this.color[0], this.color[1], this.color[2])
        );
        let textSize = Math.floor((1.5 * this.diameter) / this.word.length);

        this.sketch.textSize(textSize);
        this.sketch.textFont("monospace");
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.text(this.word, this.x, this.y);
    }

    // This function prints the bubble by reducing its radius 
    async shrink() {
        this.sketch.strokeWeight(0);
        let diameter = Math.min(this.currentDiameter, this.diameter);
        this.sketch.fill(this.color);
        this.sketch.circle(this.x, this.y, diameter);

        this.sketch.fill(
            this.colors.textColor(this.color[0], this.color[1], this.color[2])
        );
        let textSize = Math.floor((1.5 * diameter) / this.word.length);
        if (textSize !== 0) {
            this.sketch.textSize(
                Math.floor((1.5 * diameter) / this.word.length)
            );
            this.sketch.textFont("monospace");
            this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
            this.sketch.text(this.word, this.x, this.y);
        }

        this.currentDiameter -= 3;
        if (this.currentDiameter <= 0) {
            this.lifeCycle = "destroyed";
            this.createNew();
        }
    }

    // Returns true if clickX and clickY is within the circle
    clicked(clickX, clickY) {
        if (
            this.sketch.dist(clickX, clickY, this.x, this.y) <=
            this.diameter / 2
        )
            return true;
        return false;
    }

    // Called when the bubble was clicked
    onClick() {
        this.lifeCycle = "dying";
    }

    // This is called when the bubble has shrunk to zero.
    createNew() {
        generateSimilarWords(undefined, this.word);
        console.log(this.word);
    }
}

class Colors {
    constructor() {
        this.pastColors = new Set(); // store the previously generated colors
    }

    // This function calculates the intensity of the background based on the formula (Check ReadMe)
    intensity(red, green, blue) {
        return 1 - (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
    }

    // Generates a random number between 0, 255
    randomNum() {
        return Math.floor(Math.random() * 256);
    }

    // Generates rgb combination. If noRepeat is true, it doesn't generate same color again
    generateRandomColor(noRepeat = true) {
        let red = this.randomNum();
        let green = this.randomNum();
        let blue = this.randomNum();

        let color = [red, green, blue];
        if (noRepeat) {
            while (this.pastColors.has(color)) {
                color = [this.randomNum(), this.randomNum(), this.randomNum()];
            }
        }

        this.pastColors.add(color);
        return color;
    }

    // This returns white or black depending upon the intensity
    textColor(r, g, b) {
        if (this.intensity(r, g, b) < 0.5) return "#000000";
        return "#ffffff";
    }
}
