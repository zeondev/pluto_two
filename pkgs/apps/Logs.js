import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/Icons.js";
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
      //If down arrow key paressed
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
      title: langManager.getString("logs.name"),
      width: 425,
      height: 457,
      onclose: () => {
        Root.End();
      },
    });

    // let setTitle = (t) =>
    //   (win.window.querySelector(".win-titlebar .title").innerText = t);

    let wrapper = win.window.querySelector(".win-content");

    let dc = window.log;
    async function buildTable() {
      table.clear();

      new Html("thead")
        .appendMany(
          new Html("tr").appendMany(
            new Html("th").text("Type"),
            new Html("th").text("content")
          )
        )
        .appendTo(table);

      for (let i = dc.length; i > 0; i--) {
        new Html("tbody")
          .appendMany(
            new Html("tr").appendMany(
              new Html("td").text(dc[i - 1].type),
              new Html("td").text(JSON.stringify(dc[i - 1].content))
              //         why ^^^^^^^^^^ ??? what
            )
          )
          .appendTo(table);
      }
    }

    let table = new Html("table").appendTo(wrapper);
    buildTable();

    document.addEventListener("pluto.consoleEvent", (e) => {
      if (e.detail == "refreshList") {
        buildTable();
      }
    });

    document.addEventListener("pluto.lang-change", (e) => {
      win.setTitle(langManager.getString("logs.name"));
    });
  },
  end: async function () {
    // Close the window when the process is exited
    win.close();
    return true;
  },
};

export default pkg;
