const express = require("express");

const router = new express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/chat-room", (req, res) => {
  res.render("chatRoom");
});

module.exports = router;
