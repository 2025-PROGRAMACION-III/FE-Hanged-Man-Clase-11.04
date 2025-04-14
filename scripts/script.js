// Variables del juego:

let currentWord = "";
let underscores = [];

let usedLetters = [];
let remainingAttempts = 6;

let playerName = "";

let stillPlaying = true;

// ============================================================================================

// TODO 1: Obtener todos los elementos del DOM

// Screens: Start Screen & Game Screen
const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");

// Form:
const form = document.getElementById("start-form");

// Displays: Player Name & Current Word
const playerNameDisplay = document.getElementById("player-display")
const currentWordDisplay = document.getElementById("word-display")

// Mensajes: Game Message
const gameMessage = document.querySelector("#game-message")

// Botones: Return Button
const returnButton = document.getElementById("return-button");

// Canvas:
const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");

// ============================================================================================

// TODO 2: Agregar el evento de clic al botón "Volver al inicio" y el evento de envío del formulario
//  - Al enviar el formulario se debe iniciar el juego
//  - Al hacer click en volver al inicio se debe ocultar la pantalla del juego y mostrar la pantalla de inicio
form.addEventListener("submit", startGame)
returnButton.addEventListener("click", toggleScreens)

// ============================================================================================

function toggleScreens() {
    // TODO 3: Invertir la visibilidad de las pantallas
    gameScreen.classList.toggle("hidden")
    startScreen.classList.toggle("hidden")
}

async function startGame(e) {
    e.preventDefault();

    const form = e.target;

    console.log("Form:")
    console.log({ form, target: e.target, event: e, elements: form.elements });

    // TODO 4: Obtener el nombre ingresado por el jugador
    const name = form.elements["player-name"].value;
    const surname = form.elements["player-surname"].value;
    const file = form.elements["player-file"].value;

    playerName = name + " - " + surname + " - " + file;

    if (name === "" || surname === "" || file === "") return;

    await initializeVariables();
    updateDisplay();
    drawHangman();
    generateKeyboard();
    toggleScreens();
}

async function initializeVariables() {
    // TODO 5: Obtener la palabra aleatoria utilizando Fetch API
    //  url: "https://67f569a9913986b16fa47d11.mockapi.io/api-words/words"
    const response = await fetch("https://67f569a9913986b16fa47d11.mockapi.io/api-words/words")
    const words = await response.json();

    currentWord = words[Math.floor(Math.random() * words.length)].word;

    console.log(currentWord)

    // Se inicializan las variables
    underscores = Array(currentWord.length).fill("_");
    usedLetters = [];
    remainingAttempts = 6;
    gameMessage.textContent = "";
    stillPlaying = true;

    // TODO 6: Actualizar el display del nombre del jugador con el valor ingresado
    playerNameDisplay.textContent = playerName;
}

function updateDisplay() {
    // TODO 7: Actualizar el display "currentWordDisplay"
    currentWordDisplay.textContent = underscores.map(letter => letter.toUpperCase()).join(" ");
}

// TODO 8: Optimizar función utilizando fragments
// TODO 9: Optimizar función aprovechando la delegación de eventos (No se debería añadir el evento "click" a cada uno de los botones)
function generateKeyboard() {
    const keyboard = document.getElementById("game-keyboard");
    keyboard.innerHTML = "";

    keyboard.addEventListener("click", (event) => {
        const target = event.target;

        // Solo manejar clicks sobre botones
        if (target.tagName === "BUTTON") {
            const letter = target.textContent.toLowerCase();
            handleKey(letter);
        }
    });

    // TODO 8.1: Crear fragmento
    const fragment = document.createDocumentFragment();

    const letters = [
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
        "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ",
        "Z", "X", "C", "V", "B", "N", "M"
    ];

    letters.forEach(letter => {
        const btn = document.createElement("button");
        btn.id = letter;
        btn.textContent = letter;
        btn.className =
            "w-[45px] h-[45px] border-grey-500 border rounded text-center";

        /* btn.addEventListener("click", () => {
            handleKey(letter.toLowerCase());
        }); */

        // TODO 8.2: Agregar el botón al fragmento en lugar de agregarlo al elemento keyboard
        fragment.appendChild(btn);
        // keyboard.appendChild(btn);
    });

    // TODO 8.3: Agregar el fragmento al DOM
    keyboard.appendChild(fragment);
}

function handleKey(letter) {
    if (!stillPlaying) return;

    // TODO 10: Obtener el botón correspondiente a la letra mediante el id
    const keyElement = document.getElementById(letter.toUpperCase());

    // Validamos que la letra no haya sido utilizada previamente
    if (usedLetters.includes(letter)) return;

    usedLetters.push(letter);

    if (currentWord.includes(letter)) {
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) underscores[i] = letter;
        }
        keyElement.classList.add("bg-green-500");
    } else {
        keyElement.classList.add("bg-red-500");
        remainingAttempts--;
        drawHangman();
    }

    updateDisplay();
    validateGameState();
}

function validateGameState() {
    if (!underscores.includes("_")) {
        stillPlaying = false;
        // TODO 11: Mostrar el mensaje: `🎉 ¡Ganaste, ${playerName}! La palabra era: ${currentWord.toUpperCase()}`
        gameMessage.textContent = `🎉 ¡Ganaste, ${playerName}! La palabra era: ${currentWord.toUpperCase()}`;
    } else if (remainingAttempts === 0) {
        stillPlaying = false;
        // TODO 12: Mostrar el mensaje: `❌ ¡Perdiste! La palabra era: ${currentWord.toUpperCase()}`
        gameMessage.textContent = `❌ ¡Perdiste! La palabra era: ${currentWord.toUpperCase()}`
    }
}

function drawHangman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;

    // Base
    ctx.beginPath();
    ctx.moveTo(10, 190);
    ctx.lineTo(190, 190);
    ctx.stroke();

    // Poste y Cabeza
    if (remainingAttempts <= 5) {
        ctx.beginPath();
        ctx.moveTo(50, 190);
        ctx.lineTo(50, 20);
        ctx.lineTo(130, 20);
        ctx.lineTo(130, 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(130, 55, 15, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Cuerpo
    if (remainingAttempts <= 4) {
        ctx.beginPath();
        ctx.moveTo(130, 70);
        ctx.lineTo(130, 120);
        ctx.stroke();
    }

    // Brazo Izquierdo
    if (remainingAttempts <= 3) {
        ctx.beginPath();
        ctx.moveTo(130, 80);
        ctx.lineTo(110, 100);
        ctx.stroke();
    }

    // Brazo Derecho
    if (remainingAttempts <= 2) {
        ctx.beginPath();
        ctx.moveTo(130, 80);
        ctx.lineTo(150, 100);
        ctx.stroke();
    }

    // Pierna Izquierda
    if (remainingAttempts <= 1) {
        ctx.beginPath();
        ctx.moveTo(130, 120);
        ctx.lineTo(110, 150);
        ctx.stroke();
    }

    // Pierna Derecha
    if (remainingAttempts <= 0) {
        ctx.beginPath();
        ctx.moveTo(130, 120);
        ctx.lineTo(150, 150);
        ctx.stroke();
    }
}