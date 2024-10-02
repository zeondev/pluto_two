import Html from "/libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from ".../libs/vfs.js";

Ws.init();

let myWindow;

const pkg = {
  name: "APAPI STORE",
  type: "app",
  privs: 0,
  start: async function (Root) {
    let wrapper = new Html("div").class("wrapper");
  },
  end: async function () {
    // Close the window when the process is exited
    myWindow.close();
  },
};

export default pkg;
