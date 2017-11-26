var socket = io.connect();

// array of words
var randomWord = "";
var currentWord = document.getElementById("currentWord");
var generateButton = document.getElementById("generate");
var hintButton = document.getElementById("hint");
var currentImage = document.getElementById("currentImage");

var questionMark = "https://image.flaticon.com/icons/png/128/39/39293.png";

socket.emit("getList");

socket.on("getRand", rng => {
  randomWord = rng;
  currentWord.innerHTML = randomWord;
  console.log(randomWord);
  currentImage.src = questionMark;
});

generateButton.addEventListener("click", () => {
  socket.emit("getRand");
});

hintButton.addEventListener("click", () => {
  socket.emit("displayImage", randomWord);
});

socket.on("displayImage", url => {
  console.log("test", url);
  var img = (document.getElementById("currentImage").src = url);
});
