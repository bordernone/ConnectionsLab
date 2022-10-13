const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const Datastore = require("nedb"),
    db = new Datastore("chats.db");

db.loadDatabase();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/message", (req, res) => {
    const { username, message } = req.body;
    if (username && message) {
        db.insert(
            { username, message, createdAt: +new Date() },
            function (err) {
                if (err) {
                    res.sendStatus(500).send("Database failed!");
                } else {
                    db.find({})
                        .sort({ createdAt: 1 })
                        .exec((err, docs) => {
                            if (err) {
                                res.sendStatus(500).send("Database failed!");
                            } else {
                                res.json({
                                    time: +new Date(),
                                    data: docs,
                                });
                            }
                        });
                }
            }
        );
    } else {
        res.sendStatus(403).send("Username or Message undefined");
    }
});

app.get("/messages", (req, res) => {
    db.find({})
        .sort({ createdAt: 1 })
        .exec((err, docs) => {
            if (err) {
                res.sendStatus(500).send("Database failed!");
            } else {
                res.json({
                    time: +new Date(),
                    data: docs,
                });
            }
        });
});

app.use("/", express.static("public"));

app.listen(3000, (e) => {
    if (!e) console.log("Running");
});
