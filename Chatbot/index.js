const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { instrument } = require("@socket.io/admin-ui");
const RiveScript = require("rivescript");
const bot = new RiveScript();

const Datastore = require("nedb"),
    db = new Datastore("chats.db");

db.loadDatabase();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// ========== Setup server ======= //
app.use("/", express.static("public"));

// ========== Load Rivetscript ======= //
let botReady = false;
bot.loadDirectory("rive_files")
    .then(() => {
        bot.sortReplies();
        botReady = true;
    })
    .catch(() => {
        console.log("Error loading RiveScript files");
    });

const PORT = process.env.PORT || process.env.port || 3000;

//creating an http server ON the express app
let http = require("http");
let server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});

// ======== Socket ========== //
//add sockets on top of the http server
let io = require("socket.io");
io = new io.Server(server);

io.on("connect", (socket) => {
    console.log(`Socket ID: ${socket.id}`);

    // Send initial message
    db.find({})
        .sort({ createdAt: 1 })
        .exec((err, docs) => {
            if (err) {
                console.error(err);
                socket.emit("error", "Something went wrong!");
            } else {
                socket.emit("new_message", {
                    time: +new Date(),
                    data: docs,
                });
            }
        });

    socket.on("disconnect", () => {
        console.log(`Disconnected ID: ${socket.id}`);
    });

    // When a new message is received
    socket.on("new_message", ({ username, message }) => {
        if (username && message) {
            db.insert(
                { username, message, createdAt: +new Date() },
                function (err) {
                    if (err) {
                        console.error(err);
                        io.sockets.emit("error", "Something went wrong!");
                    } else {
                        // Bot response
                        const botName = "Bot";
                        if (botReady) {
                            bot.reply(username, message).then((reply) => {
                                db.insert(
                                    {
                                        username: botName,
                                        message: reply,
                                        createdAt: +new Date(),
                                    },
                                    function (err) {
                                        if (err) {
                                            console.error(err);
                                            io.sockets.emit(
                                                "error",
                                                "Something went wrong!"
                                            );
                                        } else {
                                            db.find({})
                                                .sort({ createdAt: 1 })
                                                .exec((err, docs) => {
                                                    if (err) {
                                                        console.error(err);
                                                        io.sockets.emit(
                                                            "error",
                                                            "Something went wrong!"
                                                        );
                                                    } else {
                                                        // Send messages
                                                        io.sockets.emit(
                                                            "new_message",
                                                            {
                                                                time: +new Date(),
                                                                data: docs,
                                                            }
                                                        );
                                                    }
                                                });
                                        }
                                    }
                                );
                            });
                        } else {
                            db.find({})
                                .sort({ createdAt: 1 })
                                .exec((err, docs) => {
                                    if (err) {
                                        console.error(err);
                                        io.sockets.emit(
                                            "error",
                                            "Something went wrong!"
                                        );
                                    } else {
                                        // Send messages
                                        io.sockets.emit("new_message", {
                                            time: +new Date(),
                                            data: docs,
                                        });
                                    }
                                });
                        }
                    }
                }
            );
        }
    });
});

instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password:
            "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS", // "changeit" encrypted with bcrypt
    },
});
