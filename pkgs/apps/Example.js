import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from "../../libs/vfs.js";

let myWindow;

const pkg = {
  name: "Welcome",
  type: "app",
  privs: 0,
  start: async function (Root) {
    console.log(Ws.data);
    myWindow = new Ws.data.win({
      title: "Compatibility",
      icon: "/assets/pluto-logo.svg",
      width: 400,
      height: 400,
    });

    let wrapper = myWindow.window.querySelector(".win-content");
    wrapper.classList.add("with-sidebar", "o-h");
    wrapper.append(
      compatibility.start(
        await fetch("/compatibility/pkgs/apps/Terminal.js").then((r) =>
          r.text()
        )
      )
    );
  },
  end: async function () {
    // Close the window when the process is exited
    myWindow.close();
  },
};

export default pkg;
