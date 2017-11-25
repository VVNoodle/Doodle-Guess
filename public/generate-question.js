var socket = io.connect();

// array of words
var wordList = [];
var randomWord = "";
var currentWord = document.getElementById("currentWord");
var generateButton = document.getElementById("generate");

socket.emit("getList");
socket.on("getList", list => {
  wordList = list.wordList;
});

function generate() {
  randomWord = wordList[Math.floor(Math.random() * wordList.length)];
}

generateButton.addEventListener("click", () => {
  generate();
  currentWord.innerHTML = randomWord;
});
