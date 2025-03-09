import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/Icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import { css } from "../../libs/templates.js";

let win;

const pkg = {
  name: "Welcome",
  type: "app",
  privs: 1,
  style: css``,
  start: async function (Root) {
    console.log(Ws.data);

    if (Root.Arguments) {
      const word = Root.Arguments;

      const firstLetter = word.charAt(0);

      const firstLetterCap = firstLetter.toUpperCase();

      const remainingLetters = word.slice(1);

      const capitalizedWord = firstLetterCap + remainingLetters;
      const appName = capitalizedWord + " ⫔";
      win = new Ws.data.win({
        title: appName,
        icon: "/assets/pluto-logo.svg",
        width: 400,
        height: 400,
      });

      let wrapper = win.window.querySelector(".win-content");
      wrapper.classList.add("with-sidebar", "o-h", "row", "h-100");

      wrapper.append(
        compatibility.start(
          await fetch(
            "/compatibility/pkgs/apps/" + capitalizedWord + ".js"
          ).then(async (a) => {
            return await a.text();
          })
        )
      );
    } else {
      Root.End();
    }
  },
  end: async function () {
    // Close the window when the process is exited
    win.close();
  },
};

export default pkg;
