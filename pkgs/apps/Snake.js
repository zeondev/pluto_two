import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import FileDialog from "../../libs/FileDialog.js";
import langManager from "../../libs/l10n/manager.js";
import { css } from "../../libs/templates.js";

let win;

let gameLoop;

let speedX = 0; //speed of snake in x coordinate.
let speedY = 0; //speed of snake in Y coordinate.
let gameOverScreenShowing = true;

function changeDirection(e) {
  if (gameOverScreenShowing == false) {
    if (e.code == "ArrowUp" && speedY != 1) {
      // If up arrow key pressed with this condition...
      // snake will not move in the opposite direction
      speedX = 0;
      speedY = -1;
    } else if (e.code == "ArrowDown" && speedY != -1) {
      //If down arrow key pressed
      speedX = 0;
      speedY = 1;
    } else if (e.code == "ArrowLeft" && speedX != 1) {
      //If left arrow key pressed
      speedX = -1;
      speedY = 0;
    } else if (e.code == "ArrowRight" && speedX != -1) {
      //If Right arrow key pressed
      speedX = 1;
      speedY = 0;
    }
  }
}

const pkg = {
  name: langManager.getString("snake.name"),
  type: "app",
  privs: 0,
  style: css`
    .gameOverScreen {
      font-family: Pixelify Sans, Inter, system-ui, -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
        "Open Sans", "Helvetica Neue", sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .gameOverScreen h1 {
      font-size: 3rem;
      color: #fff;
    }

    .gameOverScreen span {
      font-size: 1.5em;
    }
  `,
  start: async function (Root) {
    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    win = new Ws.data.win({
      title: langManager.getString("snake.name"),
      width: 425,
      height: 457,
      onclose: () => {
        Root.End();
      },
    });

    // let setTitle = (t) =>
    //   (win.window.querySelector(".win-titlebar .title").innerText = t);

    let wrapper = win.window.querySelector(".win-content");
    new Html(wrapper).style({
      padding: 0,
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
    });
    document.addEventListener("pluto.lang-change", (e) => {
      win.setTitle(langManager.getString("snake.name"));
    });

    let boardHtml = new Html("canvas").appendTo(wrapper);
    let board = boardHtml.elm;
    let blockSize = 25;
    let total_row = 17; //total row number
    let total_col = 17; //total column number
    let context;

    let snakeX = blockSize * 5;
    let snakeY = blockSize * 5;

    // Set the total number of rows and columns

    let snakeBody = [];

    let foodX;
    let foodY;
    let score = 0;

    let gameOver = false;

    let welcomeScreen = new Html("div")
      .style({
        background: "rgba(0,0,0,0.5)",
        "backdrop-filter": "blur(5px)",
        "--webkit-backdrop-filter": "blur(5px)",
        position: "absolute",
        top: 0,
        bottom: 0,
      })
      .appendMany(
        new Html("h1").html(langManager.getString("snake.name")),
        new Html("span").text(langManager.getString("snake.forPluto")),
        new Html("h3").html(langManager.getString("snake.begin"))
      )
      .class("w-100", "h-100", "gameOverScreen")
      .on("click", () => {
        welcomeScreen.cleanup();
        gameOverScreenShowing = false;
      })
      .appendTo(wrapper);

    function gameOverFunc() {
      gameOverScreenShowing = true;
      let gameOverScreen = new Html("div")
        .style({
          background: "rgba(0,0,0,0.5)",
          "backdrop-filter": "blur(5px)",
          "--webkit-backdrop-filter": "blur(5px)",

          position: "absolute",
          top: 0,
          bottom: 0,
        })
        .appendMany(
          new Html("h1").html(langManager.getString("snake.gameOver")),
          new Html("span").text(
            langManager.getString("snake.score") + ": " + score
          ),
          new Html("h3").html(langManager.getString("snake.continue"))
        )
        .class("w-100", "h-100", "gameOverScreen")
        .on("click", () => {
          gameOverScreen.cleanup();
          gameOverScreenShowing = false;
        })
        .appendTo(wrapper);

      score = 0;
    }

    // window.onload = function () {
    // Set board height and width
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    new Html(win.window).style({
      height: board.height + 32 + 2 + "px",
      width: board.width + 2 + "px",
    });
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection); //for movements
    // Set snake speed
    gameLoop = setInterval(update, 1000 / 10);
    // };

    function update() {
      console.log("game");
      if (gameOver) {
        return;
      }

      // Background of a Game
      context.fillStyle = "#13231A";
      context.fillRect(0, 0, board.width, board.height);

      // Set food color and position
      context.fillStyle = "#FF3B3B";
      context.fillRect(foodX, foodY, blockSize, blockSize);

      if (snakeX == foodX && snakeY == foodY) {
        new Audio("/assets/pick.wav").play();
        snakeBody.push([foodX, foodY]);
        score = score + 1;
        placeFood();
      }

      // body of snake will grow
      for (let i = snakeBody.length - 1; i > 0; i--) {
        // it will store previous part of snake to the current part
        snakeBody[i] = snakeBody[i - 1];
      }
      if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
      }

      context.fillStyle = "#3AFF5A";
      snakeX += speedX * blockSize; //updating Snake position in X coordinate.
      snakeY += speedY * blockSize; //updating Snake position in Y coordinate.
      context.fillRect(snakeX, snakeY, blockSize, blockSize);
      for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(
          snakeBody[i][0],
          snakeBody[i][1],
          blockSize,
          blockSize
        );
      }

      if (
        snakeX < 0 ||
        snakeX > total_col * blockSize ||
        snakeY < 0 ||
        snakeY > total_row * blockSize
      ) {
        // Out of bound condition
        gameOver = true;
        gameOverFunc();
        setTimeout(() => {
          gameOver = false;
          placeFood();
          snakeX = blockSize * 5;
          snakeY = blockSize * 5;

          // Set the total number of rows and columns
          speedX = 0; //speed of snake in x coordinate.
          speedY = 0; //speed of snake in Y coordinate.

          snakeBody = [];
          update();
        }, 1000);
      }

      for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
          // Snake eats own body
          gameOver = true;
          gameOverFunc();

          setTimeout(() => {
            gameOver = false;
            placeFood();
            snakeX = blockSize * 5;
            snakeY = blockSize * 5;

            // Set the total number of rows and columns
            speedX = 0; //speed of snake in x coordinate.
            speedY = 0; //speed of snake in Y coordinate.

            snakeBody = [];
            update();
          }, 1000);
        }
      }
    }

    // Movement of the Snake - We are using addEventListener

    // Randomly place food
    function placeFood() {
      // in x coordinates.
      foodX = Math.floor(Math.random() * total_col) * blockSize;

      //in y coordinates.
      foodY = Math.floor(Math.random() * total_row) * blockSize;
    }
  },
  end: async function () {
    // Close the window when the process is exited
    win.close();
    document.removeEventListener("keyup", changeDirection); //for movements
    clearInterval(gameLoop);
    return true;
  },
};

export default pkg;
