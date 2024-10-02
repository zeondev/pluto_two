import Html from "/libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";

Ws.init();

let myWindow;

const pkg = {
  name: "APAPI STORE",
  type: "app",
  privs: 0,
  start: async function (Root) {
    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    myWindow = new Ws.data.win({
      title: "Example app",
    });

    // Get the window body
    const wrapper = myWindow.window.querySelector(".win-content");

    // Add content to the window

    // compatibility.start()
    wrapper.appendChild(
      compatibility.start(
        await fetch("/compatibility/pkgs/apps/AppStore.js").then((r) =>
          r.text()
        )
      )
    );

    // document.body.appendChild(
    //   compatibility.start(
    //     await fetch("/compatibility/pkgs/apps/AppStore.js").then((r) =>
    //       r.text()
    //     )
    //   )
    // );
    // new Html("h1").text("Example App").appendTo(wrapper);
    // new Html("p").text("This is the example app").appendTo(wrapper);
  },
  end: async function () {
    // Close the window when the process is exited
    myWindow.close();
  },
};

export default pkg;
