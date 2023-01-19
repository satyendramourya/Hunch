const letters = document.querySelectorAll(".board");
const loadingDiv = document.querySelector(".info");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function inti() {
  let currentGuess = "";
  let currentRow = 0;
  let done = false;
  let isLoding = true;

  setLoding(isLoding);
  const response = await fetch(
    "https://words.dev-apis.com/word-of-the-day?random=1"
  );
  const data = await response.json();
  const answer = data.word.toUpperCase();
  const answerParts = answer.split("");
  isLoding = false;
  setLoding(isLoding);
  console.log(answer); // for testing

  function addLetter(letter) {
    // add letter to the board
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      //replaces the last letter
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
      letter;
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    //validate the guess
    // do all the markings correct , close , wrong
    const guessParts = currentGuess.split("");
    const map = makeMap(guessParts);
    console.log(map);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === answerParts[i]) {
        letters[ANSWER_LENGTH * currentRow + i].classList.add("correct");
        map[guessParts[i]]--; //decrement the count of the letter
      } else if (!answerParts.includes(guessParts[i])) {
        letters[ANSWER_LENGTH * currentRow + i].classList.add("invalid");
        map[guessParts[i]]--; //decrement the count of the letter
      } else {
        letters[ANSWER_LENGTH * currentRow + i].classList.add("close");
      }
    }
    console.log(map);

    currentRow++;
    currentGuess = "";

    console.log(guessParts, "-----", answerParts);
    if (guessParts.join("") === answerParts.join("")) {
      //TODO
      alert("You Win");
      done = true;
    } else if (currentRow === ROUNDS) {
      //TODO
      alert(`You Lose. The answer was ${answer}`);
      done = true;
    }
  }

  function markInvalidWord() {
    for (let i = 0; i < currentGuess.length; i++) {
      letters[ANSWER_LENGTH * currentRow + i].classList.remove("invalid");
      setTimeout(
        () => letters[ANSWER_LENGTH * currentRow + i].classList.add("invalid"),
        10
      );
    }
  }

  function backspace() {
    // remove letter from the board
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;
    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing -- ignore
    }
  });
}
function setLoding(isLoding) {
  loadingDiv.classList.toggle("hidden", !isLoding);
}

function isLetter(str) {
  return /^[a-zA-Z]$/.test(str);
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}

inti();
