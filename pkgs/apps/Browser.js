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

const pkg = {
  name: langManager.getString("browser.name"),
  type: "app",
  privs: 0,

  style: css`
    .selected {
      background-color: var(--neutral);
    }
  `,
  start: async function (Root) {
    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    win = new Ws.data.win({
      title: langManager.getString("browser.name"),
      width: 312,
      height: 248,
      onclose: () => {
        Root.End();
      },
    });

    // let setTitle = (t) =>
    //   (win.window.querySelector(".win-titlebar .title").innerText = t);

    let wrapper = win.window.querySelector(".win-content");
    var currentTab = 0;
    wrapper.classList.add("o-h", "col", "h-100", "w-100");
    wrapper.style.overflow = "hidden";
    wrapper.style.padding = "0";

    let tabs = [
      {
        id: 0,
        title: "New Tab",
        url: "about:blank",
        elm: undefined,
      },
      {
        id: 1,
        title: "New Tab",
        url: "https://zeon.dev",
        elm: undefined,
      },
    ];
    let frames = [];

    window.tabs = tabs;
    window.frames = frames;
    let topInputBar = new Html("div")
      .style({
        display: "flex",
        "flex-direction": "row",
        "justify-content": "center",
        "align-items": "center",
        "border-bottom": "1px solid var(--outline)",
        height: "min-content",
        gap: "5px",
      })
      .appendTo(wrapper);

    new Html("button")
      .class("small")
      .style({
        border: "none",
        padding: "0px",
        "margin-left": "4px",
        height: "min-content",
      })
      .append(
        new Html("span").html(icons.back).style({
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          transform: "scale(0.75)",
        })
      )
      .on("click", () => {
        goBackwardsCurrentTab();
      })
      .appendTo(topInputBar);
    new Html("button")
      .class("small")
      .style({
        border: "none",
        padding: "0px",
        "margin-left": "0px",
        height: "min-content",
      })
      .append(
        new Html("span").html(icons.arrowRight).style({
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          transform: "scale(0.75)",
        })
      )
      .on("click", () => {
        goForwardCurrentTab();
      })
      .appendTo(topInputBar);
    new Html("button")
      .class("small")
      .style({
        border: "none",
        padding: "0px",
        height: "min-content",
      })
      .append(
        new Html("span").html(icons.refresh).style({
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          transform: "scale(0.75)",
        })
      )
      .on("click", () => {
        refreshCurrentTab();
      })
      .appendTo(topInputBar);
    let input = new Html("input")
      .style({
        width: "75%",
        border: "none",
      })
      .attr({ placeholder: "Search or enter address" })
      .on("keydown", (e) => {
        if (e.key == "Enter") changeCurrentTabSource();
      })
      .appendTo(topInputBar);
    new Html("button")
      .class("small")
      .style({
        border: "none",
        padding: "0px",
        margin: "0px",
        height: "min-content",
      })
      .append(
        new Html("span").html(icons.arrowRight).style({
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          transform: "scale(0.75)",
        })
      )
      .on("click", () => {
        changeCurrentTabSource();
      })
      .appendTo(topInputBar);

    new Html("button")
      .class("small")
      .style({
        border: "none",
        padding: "0px",
        height: "min-content",
      })
      .append(
        new Html("span")
          .html(
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`
          )
          .style({
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            transform: "scale(0.75)",
          })
      )
      .on("click", () => {
        newTab();
      })
      .appendTo(topInputBar);

    let tabWrapper = new Html("div")
      .styleJs({
        display: "flex",
        width: "100%",
        "border-bottom": "1px solid var(--outline)",
        "flex-direction": "row",
        height: "min-content",
      })
      .appendTo(wrapper);
    function selectTab(id) {
      currentTab = id;

      tabs.forEach((tab) => {
        if (tab !== undefined) {
          if (Number(tab.id) === id) {
            input.elm.value = tab.url;
          } else {
            tab.elm.classOff("selected");
          }
        }
      });
      frames.forEach((frame) => {
        if (frame !== undefined) {
          if (Number(frame.elm.id) === id) {
            frame.elm.style.display = "block";
          } else {
            frame.elm.style.display = "none";
          }
        }
      });
    }
    function refreshCurrentTab() {
      if (frames[currentTab] && frames[currentTab].elm) {
        const currentSrc = frames[currentTab].elm.src;
        frames[currentTab].elm.src = ""; // Clear the src
        frames[currentTab].elm.src = currentSrc; // Set it back to the original src
      }
    }

    function changeCurrentTabSource() {
      tabs[currentTab].url = input.elm.value;
      frames[currentTab].elm.src = input.elm.value;
    }

    function isSameOrigin(iframe) {
      try {
        return iframe.contentWindow.location.origin === window.location.origin;
      } catch (e) {
        return false;
      }
    }

    function goForwardCurrentTab() {
      if (
        frames[currentTab] &&
        frames[currentTab].elm &&
        isSameOrigin(frames[currentTab].elm)
      ) {
        frames[currentTab].elm.contentWindow.history.forward();
      } else {
        console.warn("Cannot navigate forward: cross-origin iframe");
      }
    }

    function goBackwardsCurrentTab() {
      if (
        frames[currentTab] &&
        frames[currentTab].elm &&
        isSameOrigin(frames[currentTab].elm)
      ) {
        frames[currentTab].elm.contentWindow.history.back();
      } else {
        console.warn("Cannot navigate backward: cross-origin iframe");
      }
    }

    function getCurrentTabTitle() {
      if (
        frames[currentTab] &&
        frames[currentTab].elm &&
        isSameOrigin(frames[currentTab].elm)
      ) {
        return frames[currentTab].elm.contentWindow.document.title;
      } else {
        console.warn("Cannot get title: cross-origin iframe");
        return null;
      }
    }

    function newTab() {
      let tabId = Math.floor(Math.random() * 10000000);
      tabs[tabId] = {
        id: tabId,
        title: "New Tab",
        url: "about:blank",
        elm: undefined,
      };
      refreshTabList();
      selectTab(tabId);
    }

    function refreshTabList() {
      currentTab = 0;
      tabWrapper.html("");
      tabs.forEach((tab) => {
        if (tab !== undefined) {
          let tabElm = new Html("div")
            .id(tab.id)
            .style({
              padding: "7.5px",
              "border-right": "1px solid var(--outline)",
              cursor: "pointer",
              height: "min-content",
            })
            .appendMany(
              new Html("span").text(tab.title).on("click", async () => {
                console.log("you just clicked", tab.id);
                await selectTab(tab.id);
                tab.elm.classOn("selected");
              }),
              new Html("span")
                .html(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`
                )
                .style({
                  "margin-left": "15px",
                })
                .on("click", () => {
                  // console.log("Before filtering tabs:", tabs);
                  // tabs = tabs.filter((t) => t.id !== tab.id);
                  // console.log("After filtering tabs:", tabs);

                  // console.log("Before filtering frames:", frames);
                  // frames = frames.filter((f) => f.elm.id !== tab.id);
                  // console.log("After filtering frames:", frames);
                  // remove frame
                  console.error(tab.id, tab, frames);

                  frames[tab.id].elm.remove();
                  frames[tab.id] = undefined;
                  tabs[tab.id] = undefined;
                  refreshTabList();
                })
            )
            .appendTo(tabWrapper);

          if (tab.elm === undefined) {
            tab.elm = tabElm;
          }
          //   .elm.addEventListener("click", () => {
          //     tabs.forEach((tab) => {
          //       tab.elm.style.backgroundColor = "";
          //     });
          //     tab.elm.style.backgroundColor = "#000";
          //   });
          if (frames[tab.id] === undefined) {
            console.log(frames, tab.id);
            frames[tab.id] = new Html("iframe")
              .style({
                display: "none",
                width: "100%",
                height: "100%",
              })
              .id(tab.id)
              .attr({ src: tab.url })
              .appendTo(wrapper);
            frames[tab.id].elm.onload = function () {
              let newName = (tabs[tab.id].title = new URL(
                tabs[tab.id].url
              ).hostname.replace(/^www\./, ""));

              if (newName == undefined || newName == "") {
                tabs[tab.id].title = "New Tab";
              }
              refreshTabList();
              console.log("Updated tab title:", tabs[tab.id].title);
            };
            //   tab.elm.style.backgroundColor = "#000";
            if (tab.id === 0) {
              frames[tab.id].style({ display: "block" });
            }
          }
        }
      });
    }
    refreshTabList();

    document.addEventListener("pluto.lang-change", (e) => {
      win.setTitle(langManager.getString("browser.name"));
      makeSidebar();
    });
  },
  end: async function () {
    // Close the window when the process is exited
    win.close();
    return true;
  },
};

export default pkg;
