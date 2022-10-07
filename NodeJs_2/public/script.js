let usernameInput, wordInput;
let output;
let username;

window.onload = async (event) => {
    usernameInput = document.getElementById("username-input");
    wordInput = document.getElementById("word-input");
    output = document.getElementById("output-area");
};

const saveUsername = (e) => {
    clearOutput();
    username = usernameInput.value;
    getData();
    alert("Username saved!");
};

const saveWord = async (e) => {
    if (!username || username.length == 0) {
        alert("Please set a username");
        return;
    }
    word = wordInput.value;
    try {
        await fetch(`/data/${username}/?word=${word.toString()}`);
        getData();
    } catch (e) {}
};

const getData = async () => {
    try {
        let res = await (await fetch(`/data/${username}/all`)).json();
        displayWords(res.words);
    } catch (e) {}
};

const displayWords = (list) => {
    let elem = list.reduce((final, item) => final + `<span>${item}</span>`, "");
    output.innerHTML = elem;
};

const clearOutput = () => (output.innerHTML = "");
