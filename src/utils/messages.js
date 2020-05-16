const moment = require("moment");

const messageFormat = (username, text, time) => {
  return {
    username,
    text,
    time,
  };
};

module.exports = messageFormat;
