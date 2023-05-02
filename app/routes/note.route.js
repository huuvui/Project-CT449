const express = require("express");
const notes = require("../controllers/note.controller");

const noterouter = express.Router();

noterouter.route("/")
    .get(notes.findAll)
    .post(notes.create)
    .delete(notes.deleteAll);

noterouter.route("/favorite")
    .get(notes.findAllFavorite);

noterouter.route("/:id")
    .get(notes.findOne)
    .put(notes.update)
    .delete(notes.delete);

module.exports = noterouter;
