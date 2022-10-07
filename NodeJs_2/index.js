const express = require("express");

const app = express();

let usersData = new Map();

app.get("/data/:username/all", (req, res) => {
    const { username } = req.params;
    if (usersData.has(username)) {
        res.json({
            words: usersData.get(username),
        });
    } else {
        res.sendStatus(404);
    }
});

app.get("/data/:username/", (req, res) => {
    const { word } = req.query;
    if (!word) {
        res.sendStatus(404);
    } else {
        const { username } = req.params;
        let data = [word];
        if (usersData.has(username)) {
            data = [...data, ...usersData.get(username)];
        }
        usersData.set(username, data);
        res.sendStatus(200).send("Added!");
    }
});

app.use("/", express.static("public"));

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to ${port}`);
});
