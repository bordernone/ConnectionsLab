const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let data = [];

app.post("/message", (req, res) => {
    const { username, message } = req.body;
    if (username && message) {
        data = [...data, { username, message }];
        res.json({
            time: +new Date(),
            data: data,
        });
    } else {
        res.sendStatus(403).send("Username or Message undefined");
    }
});

app.get("/messages", (req, res) => {
    res.json({
        time: +new Date(),
        data: data,
    });
});

app.use("/", express.static("public"));

app.listen(3000, (e) => {
    if (!e) console.log("Running");
});
