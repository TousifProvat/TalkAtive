const users = [];

//add user

const addUser = (id, username, room) => {
  //cleaning data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //check for existing
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  //validate username
  if (existingUser) {
    return {
      error: "Username exists in this room",
    };
  }
  //store user

  const user = { id, username, room };
  users.push(user);
  return user;
};

//get user

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

//user leaves chat room

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

//get room users

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  getUser,
  userLeave,
  getRoomUsers,
};
