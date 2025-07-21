import Html from "../../libs/html.js";
import Ws from "../../libs/windowSystem.js";
import compatibility from "../../libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import { css } from "../../libs/templates.js";
import ThemeLib from "../../libs/ThemeLib.js";
import Accounts from "../../libs/Accounts.js";
import Icons from "../../components/Icons.js";
import icons from "../../components/Icons.js";
import FileMappings from "../../libs/FileMappings.js";
// import Sortable from "sortablejs/modular/sortable.complete.esm.js";

let wrapper; // Lib.html | undefined

export default {
  name: "Desktop",
  type: "app",
  privs: 1,
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
      padding: 6px 6px 6px 6px;
      overflow: visible;
      transform: translateX(-50%);
      z-index: 9999999;
      background-color: var(--root);
      border-radius: 16px;
      border: 1px solid var(--outline);
      box-shadow: 0 0 36px -2px var(--outline);
    }
    .desktop .dock .app {
      width: 3.4rem;
      height: 3.4rem;
      display: flex;
      align-self: center;
      align-items: center;
      align-content: center;
      transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1),
        margin 0.2s linear;
      transform-origin: center bottom;
      margin-left: 0.3rem;
      margin-right: 0.3rem;
      border-radius: 9px;
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

    .desktop .dock .app svg {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    .desktop .dock .app.startmenubutton {
      width: 2.5rem;
      height: 2.5rem;
      margin-left: 0.5rem;
      margin-right: 1rem;
      transform-origin: center center;
    }

    .desktop .dock .app.startmenubutton:hover {
      transform: scale(1.1);
    }

    .window-box.maximized-window ~ .desktop .dock {
      transform: translate(-50%, 120%) !important;
    }

    .desktop .startMenu {
      width: 70%;
      max-width: 450px;
      position: absolute;
      bottom: calc(8px + 3.4rem + 13px + 10px);
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--root);
      border-radius: 16px;
      border: 1px solid var(--outline);
      box-shadow: 0 0 36px -2px var(--outline);
      z-index: 9999999;
      padding: 6px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      gap: 6px;
    }

    .desktop .startMenu.hide {
      display: none;
    }
    .desktop .startMenu.show {
      display: flex;
    }

    .desktop .startMenu .topWrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 10px;
    }

    .desktop .startMenu .topWrapper .actions {
      display: flex;
      align-items: center;
      padding: 10px;
      gap: 10px;
    }

    .desktop .startMenu .topWrapper .actions button {
      height: 40px;
      width: 40px;
      background-color: var(--root);
      padding: 0px;
    }
    .desktop .startMenu .topWrapper .actions button:hover {
      background-color: var(--neutral);
    }

    .desktop .startMenu .topWrapper .info {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px;
      gap: 10px;
    }

    .desktop .startMenu .topWrapper .info .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .desktop .startMenu .topWrapper .info .usernameWrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .desktop .startMenu .topWrapper .info .usernameWrapper .username {
      color: var(--text);
      font-size: 0.9rem;
    }

    .desktop .startMenu .topWrapper .info .usernameWrapper .status {
      color: var(--label);
      font-size: 0.8rem;
    }

    .desktop .startMenu .startMenuContent {
      height: auto !important;
      min-height: 0 !important;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, auto);
      gap: 10px;
      padding: 10px;
    }

    .desktop .startMenu .startMenuContent .app {
      transition: transform 0.3s ease;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding-bottom: 35px;
    }

    .desktop .startMenu .startMenuContent .app .icon {
      width: 60px;
      height: 60px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .desktop .startMenu .startMenuContent .app .title {
      color: var(--text);
      font-size: 0.9rem;
      text-align: center;
    }
    .ghost {
      opacity: 0;
    }

    .desktop .startMenu .startMenuContent .app:hover {
      transform: scale(1.2);
    }

    .allAppsContainer {
      width: 100%;
    }

    .allAppsContainer .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: 300px;
      overflow-y: auto;
      max-height: 0;
      transition: max-height var(--animation-duration) var(--easing-function);
      height: 300px;
    }

    .allAppsContainer .content .app {
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 10px;
      padding: 10px;
    }

    .allAppsContainer .content img {
      width: 48px;
      height: 48px;
    }

    .allAppsContainer .allApps {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--root);
      border-radius: 8px;
      padding: 5px;
      color: var(--text);
      font-size: 0.9rem;
      cursor: pointer;
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

    let userData = Accounts.getUserData();

    let dock = new Html("div")
      .appendTo(wrapper)
      .class("dock", "slideInCenteredFromBottom");

    document.addEventListener("pluto.wallpaper-change", (e) => {
      console.log("got wallpaper change event", e);
      wrapper.style({ "background-image": `url(${e.detail})` });
    });

    let appearanceConfigRaw = await Vfs.readFile(
      "Root/Pluto/config/appearanceConfig.json"
    );
    let appearanceConfig = JSON.parse(appearanceConfigRaw);

    async function checkTheme() {
      if (appearanceConfig.theme && appearanceConfig.theme.endsWith(".theme")) {
        const x = ThemeLib.validateTheme(
          await Vfs.readFile(
            "Root/Pluto/config/themes/" + appearanceConfig.theme
          )
        );

        console.log(x);

        if (x !== undefined && x.success === true) {
          console.log(x);
          console.error(x);
          ThemeLib.setCurrentTheme(x.data);
        } else {
          console.log("MESSAGE HERE", x.message);
          document.documentElement.dataset.theme = "dark";
        }
      } else {
        console.error("FARDED");
        ThemeLib.setCurrentTheme(
          '{"version":1,"name":"Dark","description":"A built-in theme.","values":null,"cssThemeDataset":"dark","wallpaper":"./assets/wallpapers/space.png"}'
        );
      }
    }

    checkTheme();

    let allStockApps = [
      {
        name: "Music",
        icon: "./assets/apps/Radio.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Music", true, true);
        },
      },
      {
        name: "Notepad",
        icon: "./assets/apps/Notepad.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Notepad", true, true);
        },
      },
      {
        name: "Store",
        icon: "./assets/apps/Store.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Store", true, true);
        },
      },
      {
        name: "File Manager",
        icon: "./assets/apps/FileManager.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:FileManager", true, true);
        },
      },
      {
        name: "Settings",
        icon: "./assets/apps/Settings.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Settings", true, true);
        },
      },
      {
        name: "Weather",
        icon: "./assets/apps/Weather.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Weather", true, true);
        },
      },
      {
        name: "Terminal",
        icon: "./assets/apps/Terminal.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Terminal", true, true);
        },
      },
      {
        name: "Snake",
        icon: "./assets/apps/Snake.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Snake", true, true);
        },
      },
      {
        name: "Browser",
        icon: "./assets/apps/Browser.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Browser", true, true);
        },
      },
      {
        name: "Photos",
        icon: "./assets/apps/Photos.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Photos", true, true);
        },
      },
      {
        name: "DevEnv",
        icon: "./assets/apps/DevEnv.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:DevEnv", true, true);
        },
      },
      {
        name: "Videos",
        icon: "./assets/apps/Videos.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Videos", true, true);
        },
      },
      {
        name: "Task Manager",
        icon: "./assets/apps/TaskManager.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:TaskManager", true, true);
        },
      },
    ];

    const installedApps = (await Vfs.list("Root/Pluto/apps"))
      .filter((f) => f.item.endsWith(".app") || f.item.endsWith(".pml"))
      .map((f) => {
        return { type: "installed", item: f.item };
      });
    let asApps = [];
    const asExists = await Vfs.whatIs("Registry/AppStore/_AppStoreIndex.json");
    if (asExists !== null) {
      console.log(asExists);
      asApps = (await Vfs.list("Registry/AppStore"))
        .filter((f) => f.item.endsWith(".app") || f.item.endsWith(".pml"))
        .map((f) => {
          return { type: "appStore", item: f.item };
        });
    }
    let tempList = [...installedApps, ...asApps];
    let tempList2 = [];
    console.warn(installedApps, asApps);
    let i = 0;
    for (i = 0; i < tempList.length; i++) {
      let app = tempList[i];
      let name = "";
      let icon = "";
      if (app.type === "appStore") {
        name = JSON.parse(
          await Vfs.readFile("Registry/AppStore/_AppStoreIndex.json")
        )[String(app.item).replace(".app", "").replace(".pml", "")].name;
        icon = JSON.parse(
          await Vfs.readFile("Registry/AppStore/_AppStoreIndex.json")
        )[String(app.item).replace(".app", "").replace(".pml", "")].icon;
        alert(name);
      } else {
        name = app.item.replace(".app", "").replace(".pml", "");
        const data = await FileMappings.retrieveAllMIMEdata(
          "Root/Desktop/" + app.item
        );
        // regex all special characters for data uri including < > / \ : * ? " ' |
        icon =
          "data:image/svg+xml," + encodeURIComponent(icons[String(data.icon)]);
      }
      const data = await FileMappings.retrieveAllMIMEdata(
        "Root/Desktop/" + app.item
      );
      tempList2.push({
        name: name,
        icon: icon,
        onClick: async () => {
          await Root.Core.Packages.Run(
            "apps:" + app.item.replace(".app", "").replace(".pml", ""),
            true,
            true
          );
        },
      });
      console.error(data);
    }

    let allAppsList = [...allStockApps, ...tempList2];
    let startMenuList = [
      {
        name: "Music",
        icon: "./assets/apps/Radio.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Music", true, true);
        },
      },
      {
        name: "Notepad",
        icon: "./assets/apps/Notepad.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Notepad", true, true);
        },
      },
      {
        name: "Store",
        icon: "./assets/apps/Store.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Store", true, true);
        },
      },
      {
        name: "File Manager",
        icon: "./assets/apps/FileManager.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:FileManager", true, true);
        },
      },
      {
        name: "Settings",
        icon: "./assets/apps/Settings.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Settings", true, true);
        },
      },
      {
        name: "Weather",
        icon: "./assets/apps/Weather.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Weather", true, true);
        },
      },
      {
        name: "Terminal",
        icon: "./assets/apps/Terminal.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Terminal", true, true);
        },
      },
      {
        name: "Snake",
        icon: "./assets/apps/Snake.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Snake", true, true);
        },
      },
    ];

    let startMenuApps = [];

    startMenuList.forEach((app) => {
      startMenuApps.push(
        new Html("div")
          .class("app")
          .appendMany(
            new Html("div").class("icon").style({
              "background-image": "url(" + app.icon + ")",
            }),
            new Html("span").class("title").html(app.name)
          )
          .on("click", () => {
            if (startMenu.elm.classList.contains("show")) {
              startMenu.class(
                "slideInCenteredFromBottom",
                "slideOutCenteredFromBottom"
              );
              setTimeout(() => {
                startMenu.class("hide", "show");
              }, 300);
            } else {
              startMenu.class(
                "hide",
                "show",
                "slideInCenteredFromBottom",
                "slideOutCenteredFromBottom"
              );
            }
            app.onClick();
          })
      );
    });

    let userDisplay = new Html("div")
      .class("info")
      .appendMany(
        new Html("div")
          .class("avatar")
          .style({ "background-image": "url(" + userData.pfp + ")" }),
        new Html("div")
          .class("usernameWrapper")
          .appendMany(
            new Html("div")
              .class("username")
              .html("Hello, " + userData.username),
            new Html("div")
              .class("status")
              .html(
                userData.onlineAccount ? "Online Account" : "Offline Account"
              )
          )
      );

    let smc = new Html("div")
      .class("startMenuContent")
      .appendMany(...startMenuApps);
    let allAppsContent = new Html("div").class("content").appendMany(
      ...allAppsList.map((app) => {
        return new Html("div")
          .class("app")
          .appendMany(
            new Html("img").class("icon").attr({
              src: app.icon,
            }),
            new Html("span").class("title").html(app.name)
          )
          .on("click", async () => {
            if (startMenu.elm.classList.contains("show")) {
              startMenu.class(
                "slideInCenteredFromBottom",
                "slideOutCenteredFromBottom"
              );
              setTimeout(() => {
                startMenu.class("hide", "show");
              }, 300);
            } else {
              startMenu.class(
                "hide",
                "show",
                "slideInCenteredFromBottom",
                "slideOutCenteredFromBottom"
              );
            }
            let thisElm = allApps.qs(".allApps").elm;
            thisElm.classList.toggle("active");
            var content = thisElm.nextElementSibling;
            if (content.style.display === "flex") {
              content.style.maxHeight = null;
              thisElm.innerHTML = icons.chevronUp + "All Apps";

              setTimeout(() => {
                content.scrollTo(0, 0);
                content.style.display = "none";
              }, 500);
            } else {
              content.style.display = "flex";
              thisElm.innerHTML = icons.chevronDown + "All Apps";
              content.style.maxHeight = content.scrollHeight + "px";
            }
            app.onClick();
          });
      })
    );
    let allApps = new Html("div")
      .class("allAppsContainer")
      .appendMany(
        new Html("div").class("allApps").html(icons.chevronUp + "All Apps"),
        allAppsContent
      );

    let startMenu = new Html("div")
      .appendTo(wrapper)
      .appendMany(
        new Html("div").class("topWrapper").appendMany(
          userDisplay,
          new Html("div").class("actions").appendMany(
            new Html("button").html(Icons.wrench).on("click", () => {
              Root.Core.Packages.Run("apps:Settings", true, true);
              // hide sm
              startMenu.class(
                "slideInCenteredFromBottom",
                "slideOutCenteredFromBottom"
              );
              setTimeout(() => {
                startMenu.class("hide", "show");
              }, 300);
            }),
            new Html("button").html(Icons.power)
          )
        ),
        smc,
        allApps
      )
      .class("startMenu", "slideOutCenteredFromBottom", "hide");

    allApps.qs(".allApps").elm.addEventListener("click", async function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "flex") {
        content.style.maxHeight = null;
        this.innerHTML = icons.chevronUp + "All Apps";

        setTimeout(() => {
          content.scrollTo(0, 0);
          content.style.display = "none";
        }, 500);
      } else {
        content.style.display = "flex";
        this.innerHTML = icons.chevronDown + "All Apps";
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });

    let grid = document.querySelector(".desktop .startMenu .startMenuContent");
    new Sortable(grid, {
      animation: 150,
      ghostClass: ".ghost",
    });

    let taskbarApps = [
      {
        name: "Weather",
        icon: "./assets/apps/Weather.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Weather", true, true);
        },
      },
      {
        name: "Browser",
        icon: "./assets/apps/Browser.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Browser", true, true);
        },
      },
      {
        name: "Music",
        icon: "./assets/apps/Radio.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Music", true, true);
        },
      },
      {
        name: "Snake",
        icon: "./assets/apps/Snake.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:Snake", true, true);
        },
      },
      {
        name: "File Manager",
        icon: "./assets/apps/FileManager.svg",
        onClick: async () => {
          await Root.Core.Packages.Run("apps:FileManager", true, true);
        },
      },
    ];

    let plutoIcon = new Html("div")
      .appendTo(dock)
      .class("app", "startmenubutton")
      .html(
        await fetch("./assets/pluto_logo_new.svg").then(async (a) => {
          return await a.text();
        })
      )
      .on("click", async () => {
        userData = Accounts.getUserData();

        startMenu.qs(".info").clear();
        startMenu
          .qs(".info")
          .appendMany(
            new Html("div")
              .class("avatar")
              .style({ "background-image": "url(" + userData.pfp + ")" }),
            new Html("div")
              .class("usernameWrapper")
              .appendMany(
                new Html("div")
                  .class("username")
                  .html("Hello, " + userData.username),
                new Html("div")
                  .class("status")
                  .html(
                    userData.onlineAccount
                      ? "Online Account"
                      : "Offline Account"
                  )
              )
          );
        if (startMenu.elm.classList.contains("show")) {
          startMenu.class(
            "slideInCenteredFromBottom",
            "slideOutCenteredFromBottom"
          );
          setTimeout(() => {
            startMenu.class("hide", "show");
          }, 300);
        } else {
          startMenu.class(
            "hide",
            "show",
            "slideInCenteredFromBottom",
            "slideOutCenteredFromBottom"
          );
        }
      });

    let appList = [];
    for (let i = 0; i < taskbarApps.length; i++) {
      let app = new Html("div")
        .appendTo(dock)
        .class("app")
        .html(
          await fetch(taskbarApps[i].icon).then(async (a) => {
            return await a.text();
          })
        )
        .on("click", taskbarApps[i].onClick);
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
    // Root.Core.Packages.Run("apps:AppStore", true, true);
  },
  end: async function () {
    wrapper.cleanup();
    return true;
  },
};
