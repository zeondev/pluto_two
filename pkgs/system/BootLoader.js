import Html from "/libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";

Ws.init();
Vfs.importFS();
let myWindow;

const pkg = {
  name: "BootLoader",
  type: "app",
  privs: 1,
  start: async function (Root) {},
  end: async function () {
    // Close the window when the process is exited
    myWindow.close();
  },
};

export default pkg;
