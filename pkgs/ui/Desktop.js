import Html from "../../libs/html.js";
import Ws from "../../libs/windowSystem.js";
import compatibility from "../../libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import { css } from "../../libs/templates.js";

let wrapper; // Lib.html | undefined

export default {
  name: "Welcome",
  type: "app",
  privs: 0,
  style: css`
    .desktop {
      display: flex;
      background-size: cover;
      background-attachment: fixed;
      background-repeat: no-repeat;
      background-position: center center;
      height: 100%;
    }
    .desktop .topBar {
      width: calc(100% + 1px);
      position: absolute;
      left: -1px;
      height: 30px;
      background-color: var(--root);
      border-bottom: 1px solid var(--outline);
      border-left: 1px solid var(--outline);
      border-right: 1px solid var(--outline);
      border-radius: 0 0 8px 8px;
      display: flex;
      gap: 5px;
    }
    .desktop .topBar .topBarItem {
      display: flex;
      align-self: center;
    }
    .desktop .topBar .topBarItem:first-child {
      margin: 10px;
    }
    .desktop .dock {
      width: 50%;
      max-width: max-content;
      display: flex;
      position: absolute;
      bottom: 8px;
      justify-content: center;
      align-items: flex-start;
      text-align: center;
      left: 50%;
      padding: 6px 14px 6px 14px;
      overflow: visible;
      transform: translateX(-50%);
      z-index: 9999999;
      background-color: var(--root);
      border-radius: 8px 8px 8px 8px;
      border: 1px solid var(--outline);
      box-shadow: 0 0 36px -2px var(--outline);
    }
    .desktop .dock .app {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      background-color: var(--text);
      align-self: center;
      align-items: center;
      align-content: center;
      transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1),
        margin 0.2s linear;
      transform-origin: center bottom;
      margin-left: 0.3rem;
      margin-right: 0.3rem;
      border-radius: 0.5rem;
    }
    .desktop .dock .app.over {
      margin-left: 0.56em;
      margin-right: 0.56em;
      transform: scale(1.28);
    }
    .desktop .dock .app.over-sm {
      margin-left: 0.35em;
      margin-right: 0.35em;
      transform: scale(1.07);
    }
    .desktop .dock {
      transition: transform 0.3s ease;
    }
    .window-box.maximized-window ~ .desktop .dock {
      transform: translate(-50%, 120%) !important;
    }
  `,
  start: async function (Root) {
    console.log("Hello from example package", Root.Lib);

    wrapper = new Html("div").appendTo("body").class("desktop");
    console.log(wrapper);

    // let topBar = new Html("div")
    //   .appendTo(wrapper)
    //   .class("topBar", "slideInFromTop");
    // let tab1 = new Html("div")
    //   .appendTo(topBar)
    //   .class("topBarItem")
    //   .html("Pluto");
    // let tab2 = new Html("div")
    //   .appendTo(topBar)
    //   .class("topBarItem")
    //   .html("Application");
    let dock = new Html("div")
      .appendTo(wrapper)
      .class("dock", "slideInCenteredFromBottom");

    document.addEventListener("pluto.wallpaper-change", (e) => {
      console.log("got wallpaper change event", e);
      wrapper.style({ "background-image": `url(${e.detail})` });
    });

    let appList = [];
    for (let i = 0; i < 5; i++) {
      let app = new Html("div").appendTo(dock).class("app");
      let index = i;
      appList.push(app);
      app.on("pointerenter", (e) => {
        e.target.classList.add("over");
        if (!(index + 1 > appList.length - 1)) {
          appList[index + 1].classOn("over-sm");
        }
        if (!(index - 1 < 0)) {
          appList[index - 1].classOn("over-sm");
        }
      });
      app.on("pointerleave", (e) => {
        e.target.classList.remove("over");
        if (!(index + 1 > appList.length - 1)) {
          appList[index + 1].classOff("over-sm");
        }
        if (!(index - 1 < 0)) {
          appList[index - 1].classOff("over-sm");
        }
      });
    }
  },
  end: async function () {
    wrapper.cleanup();
  },
};
