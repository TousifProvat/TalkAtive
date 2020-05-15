const socket = io();

//elements

const $chatForm = document.getElementById("chat-form");
const $chatFormBtn = $chatForm.querySelector("button");
const $chatFormInput = $chatForm.querySelector("input");
const $messageArea = document.getElementById("messages-area");
const $roomName = document.getElementById("roomName");
const $userList = document.getElementById("userNames");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//autoscroll
const AutoScroll = () => {
  // //new message
  // const $newMessage = $messageArea.lastElementChild;

  // //height of the new message

  // const newMessageStyles = getComputedStyle($newMessage);
  // const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // //visible height
  // const visibleHeight = $messageArea.offsetHeight;
  // //height of message container
  // const containerHeight = $messageArea.scrollHeight;

  // //how far scroller
  // const scrollOffset = $messageArea.scrollTop + visibleHeight;

  // if (containerHeight - newMessageHeight <= scrollOffset) {
  //   $messageArea.scrollTop = $messageArea.scrollHeight;
  // }

  $messageArea.scrollTop = $messageArea.scrollHeight;
};

//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server
socket.on("sysMessage", (message) => {
  botMessage(message);
  AutoScroll();
});

//message icoming
socket.on("message", (message) => {
  incomingMessage(message);
  AutoScroll();
});

//message outgoin
$chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $chatFormBtn.setAttribute("disabled", "disabled");

  const msg = e.target.elements.msg.value.trim();
  outgoingMessage(msg);
  AutoScroll();

  socket.emit("chatMessage", msg, (error) => {
    $chatFormBtn.removeAttribute("disabled");
    $chatFormInput.value = "";
    $chatFormInput.focus();

    if (error) {
      return console.log(error);
    }
  });
});

//out going message to dom
const outgoingMessage = (msg) => {
  const time = moment().format("h:mm a");
  const mymainDiv = document.createElement("div");
  mymainDiv.classList.add("my-message");
  mymainDiv.innerHTML = `
  <div class="message-content">
  <h3> Me <span class="message-time">${time}</span></h3>
  <p class="messsage">${msg}</p>
</div>
  `;

  $messageArea.appendChild(mymainDiv);
};

//icoming message to dom

const incomingMessage = (message) => {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("others-message");
  mainDiv.innerHTML = `
  <div class="message-content">
  <h3>${message.username} <span class="message-time">${message.time}</span></h3>
  <p class="messsage">${message.text}</p>
</div>
  `;

  $messageArea.appendChild(mainDiv);
};

//bot message
const botMessage = (message) => {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("bot-message");
  mainDiv.innerHTML = `
   <p>${message}</p>
  `;

  $messageArea.appendChild(mainDiv);
};

//add room name to dom
const outputRoomName = (room) => {
  $roomName.innerText = room;
};

//add users to dom

const outputUsers = (users) => {
  $userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
};

//sidebar appear for mobo version

const burgerIcon = document.querySelector(".burger");
const sideBar = document.querySelector(".sidebar");

burgerIcon.addEventListener("click", () => {
  sideBar.classList.toggle("sidebar-active");
});

// error box appear to dom

// const errorBox = (error) => {
//   const errorDiv = document.createElement("div");
//   errorDiv.classList.add("error-box");
//   errorDiv.innerHTML = `
//     <p class="error"> ${error}</p>
//   `;
//   document.getElementById("login-box").appendChild(errorDiv);

//   if (document.getElementById("login-box").firstChild) {
//     return document
//       .getElementById("login-box")
//       .replaceChild(errorDiv, document.getElementById("login-box").firstChild);
//   }
// };

//Join chat room

socket.emit("joinRoom", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
