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
    let wrapper = new Html("div")
      .class("welcome-wrapper")
      .appendTo(document.body);
    let page = new Html("div").class("page").appendTo(wrapper);
    let pageWrapper = new Html("div").class("page-wrapper").appendTo(page);
    let title = new Html("div")
      .class("title")
      .appendMany(new Html("h2").text("Welcome to Pluto"))
      .appendTo(page);
    let buttonBar = new Html("div")
      .class("button-bar")
      .appendMany(
        new Html("button")
          .text("Next")
          .on("click", () => {})
          .class("button"),
        new Html("button")
          .text("Back")
          .on("click", () => {})
          .class("button")
      )
      .appendTo(page);

    let pages = {
      p1: () => {
        pageWrapper.clear();

        new Html("img")
          .class("p1i1")
          .attr({ src: "/assets/pluto-logo.svg" })
          .appendTo(pageWrapper);
        // new Html("h1").text("Pluto").appendTo(pageWrapper);
        new Html("p")
          .class("p1p1")
          .text(
            "Pluto is a new minimal web-based operating system.\nPluto is still in development, so there may be bugs and missing features.\n\nPlease push the 'Next' button to continue."
          )
          .appendTo(pageWrapper);
      },
    };
    pages.p1();
  },
  end: async function () {
    // Close the window when the process is exited
    myWindow.close();
  },
};

export default pkg;
