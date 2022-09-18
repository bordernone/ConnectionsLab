let btn;
let inputElement;
let outputElement;

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

        // Converts an array of objects to array of words
        let wordsList = wordsData.map((item) => {
            return item.word;
        });

        // Coverts array of words to a single string
        wordsList = wordsList.reduce((result, current) => {
            return result + "<br/>" + current;
        }, "");

        updateUI(wordsList);
    } catch (e) {
        console.log("Error: ", e);
    }
};

// Add "data" to the output div
const updateUI = (data) => {
    outputElement.innerHTML = data;
};
