import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/TextSidebar.js";
import icons from "../../components/icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import langManager from "../../libs/l10n/manager.js";
import DropDown from "../../components/DropDown.js";
import ThemeLib from "../../libs/ThemeLib.js";
import Accounts from "../../libs/Accounts.js";
import CodeScanner from "../../libs/CodeScanner.js";
let userData = Accounts.getUserData();

let win;

const pkg = {
  name: langManager.getString("settings.name"),
  type: "app",
  privs: 1,
  start: async function (Root) {
    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    win = new Ws.data.win({
      title: langManager.getString("settings.name"),
      width: 500,
      height: 400,
    });

    // let setTitle = (t) =>
    //   (win.window.querySelector(".win-titlebar .title").innerText = t);

    let wrapper = win.window.querySelector(".win-content");
    wrapper.classList.add("with-sidebar", "o-h", "row", "h-100");

    let path = "Root";

    let sidebarWrapper = new Html("div")
      .styleJs({ display: "flex" })
      .appendTo(wrapper);
    const defaultDesktopConfig = {
      wallpaper: "./assets/wallpapers/space.png",
      useThemeWallpaper: true,
      theme: "dark.theme",
      sidebarType: "vertical",
      dockStyle: "full",
      dockShowTray: true,
      dockShowAssistant: true,
    };

    let desktopConfig = Object.assign(
      defaultDesktopConfig,
      JSON.parse(await Vfs.readFile("Root/Pluto/config/appearanceConfig.json"))
    );

    async function save() {
      await Vfs.writeFile(
        "Root/Pluto/config/appearanceConfig.json",
        JSON.stringify(desktopConfig)
      );
      desktopConfig = Object.assign(
        defaultDesktopConfig,
        JSON.parse(
          await Vfs.readFile("Root/Pluto/config/appearanceConfig.json")
        )
      );
    }

    function makeSidebar() {
      sidebarWrapper.clear();
      let settingsSidebar = Sidebar.new(sidebarWrapper, [
        {
          onclick: async (_) => {
            pages.system();
          },
          icon: icons.monitor,
          text: langManager.getString("settings.system"),
        },
        {
          onclick: async (_) => {
            pages.accounts();
          },
          icon: icons.user,
          text: langManager.getString("settings.accounts"),
        },
        {
          onclick: async (_) => {
            pages.appearence();
          },
          icon: icons.brush,
          text: langManager.getString("settings.appearence"),
        },
        {
          onclick: async (_) => {
            pages.network();
          },
          icon: icons.wifiConnected,
          text: langManager.getString("settings.network"),
        },
        {
          onclick: (_) => {
            pages.applications();
          },
          icon: icons.package,
          text: langManager.getString("settings.applications"),
        },
        {
          onclick: (_) => {
            pages.security();
          },
          icon: icons.shield,
          text: langManager.getString("settings.security"),
        },
      ]);

      let userData = Accounts.getUserData();
      if (userData.onlineAccount == 0) {
        new Html("button")
          .class("sidebar-item", "m-0", "transparent", "small")
          .appendMany(
            new Html("div").class("pfp").html(icons.user),
            new Html("div")
              .class("sidebar-text", "small-label")
              .style({
                "text-align": "left",
              })
              .appendMany(
                new Html("div").text("User").style({ color: "var(--text)" }),
                new Html("div").text("Offline Account")
              )
          )
          .styleJs({ bottom: "5px", position: "absolute" })
          // .on("click", (e) => {
          //   b.onclick && b.onclick(e);
          // })
          // .style(b.style || {})
          .appendTo(settingsSidebar);
      } else {
        new Html("button")
          .class("sidebar-item", "m-0", "transparent", "small")
          .appendMany(
            new Html("div")
              .class("pfp")
              .appendMany(
                new Html("img")
                  .attr({ src: userData.pfp })
                  .style({ width: "25px", "border-radius": "50%" })
              ),
            new Html("div")
              .class("sidebar-text", "small-label")
              .style({
                "text-align": "left",
              })
              .appendMany(
                new Html("div")
                  .text(userData.username)
                  .style({ color: "var(--text)" }),
                new Html("div").text("Online Account")
              )
          )
          .styleJs({ bottom: "5px", position: "absolute" })
          // .on("click", (e) => {
          //   b.onclick && b.onclick(e);
          // })
          // .style(b.style || {})
          .appendTo(settingsSidebar);
      }
    }

    const wrapperWrapper = new Html("div")
      .class("col", "w-100", "ovh", "p-2")
      .appendTo(wrapper);

    new Html("h1").text("hi").appendTo(wrapperWrapper);

    function makeHeading(type, text) {
      if (type === "h1") {
        new Html().class(type).text(text).appendTo(wrapperWrapper);
      } else {
        new Html()
          .class(type, "mt-1", "mb-1")
          .text(text)
          .appendTo(wrapperWrapper);
      }
    }
    function makeAlert(type, text) {
      new Html().class("alert", type).text(text).appendTo(wrapperWrapper);
    }

    let currentPage = "system";
    let pages = {
      system: async () => {
        currentPage = "system";
        wrapperWrapper.clear();
        new Html("h1").text("System").appendTo(wrapperWrapper);

        const sysInfo = Root.Details;

        const cardBoxIcon = new Html("div")
          .class("icon")
          .style({ "--url": "url(./assets/pluto-logo.svg)" });
        const cardBoxName = new Html("div").text(
          `${langManager.getString("generic.pluto")}`
        );
        const cardBoxType = new Html("div")
          .class("label")
          .text(sysInfo.codename);

        const cardBox = new Html("div")
          .appendMany(
            cardBoxIcon,
            new Html("div").class("text").appendMany(cardBoxName, cardBoxType)
          )
          .class("card-box", "max")
          .appendTo(wrapperWrapper);

        makeHeading("h2", langManager.getString("settings.plutoInfo"));

        let totalStorage = 0;

        // if (navigator.userAgent.indexOf("pluto/") > -1) {
        // Desktop electron app only code
        // totalStorage = await Root.Core.host.du(Root.Core.host.dir);
        // } else {
        let allKeys = await localforage.keys();
        for (let i = 0; i < allKeys.length; i++) {
          let value = await localforage.getItem(allKeys[i]);

          if (typeof value === "string") {
            totalStorage += value.length;
          } else if (value instanceof Blob) {
            totalStorage += value.size;
          }
        }
        // }

        console.log(totalStorage);

        let filesystemSize;

        if (totalStorage < 1024) {
          filesystemSize = totalStorage + " B";
        } else if (totalStorage < 1024 * 1024) {
          filesystemSize = (totalStorage / 1024).toFixed(2) + " KB";
        } else if (totalStorage < 1024 * 1024 * 1024) {
          filesystemSize = (totalStorage / 1024 / 1024).toFixed(1) + " MB";
        } else {
          filesystemSize =
            (totalStorage / 1024 / 1024 / 1024).toFixed(1) + " GB";
        }

        const plutoDetails = new Html("div")
          .class("card-box", "list", "max")
          .appendMany(
            // FS Capacity
            new Html()
              .class("item")
              .appendMany(
                new Html().text(langManager.getString("settings.storageUsed")),
                new Html().class("label").text(filesystemSize)
              ),
            // Core Version
            new Html().class("item").appendMany(
              new Html().text(langManager.getString("settings.coreVersion")),
              new Html().class("label").text(sysInfo.versionString)
              // .on("click", increaseCoreCount)
            ),
            // Supported Versions
            new Html()
              .class("item")
              .appendMany(
                new Html().text(
                  langManager.getString("settings.supportedVersions")
                ),
                new Html()
                  .class("label")
                  .text(sysInfo.minSupported.replace("<=", "≤"))
              )
          )
          .appendTo(wrapperWrapper);

        makeHeading("h2", langManager.getString("settings.yourDevice"));

        // Get browser information
        let browser = {
          name: "",
          version: "",
        };

        // Get operating system information
        let os = {
          name: "",
          version: "",
        };

        let deviceType = "Unknown";
        const webProtocol = location.protocol.endsWith("s:") ? "HTTPS" : "HTTP";
        let webHost = location.host;

        try {
          // Get user agent string
          const userAgent = navigator.userAgent;

          if (webHost === "" && userAgent.includes("Electron")) {
            webHost = "Local (Electron)";
          } else if (webHost === "") {
            webHost = "Local";
          }

          // Desktop app support
          if (userAgent.indexOf("pluto") > -1) {
            browser.name = "Pluto Desktop";
            browser.version = userAgent.match(/pluto\/([\d.]+)/)[1];
          } else if (userAgent.indexOf("Firefox") > -1) {
            browser.name = "Firefox";
            browser.version = userAgent.match(/Firefox\/([\d.]+)/)[1];
          } else if (userAgent.indexOf("Chrome") > -1) {
            browser.name = "Chrome";
            browser.version = userAgent.match(/Chrome\/([\d.]+)/)[1];
          } else if (userAgent.indexOf("Safari") > -1) {
            browser.name = "Safari";
            browser.version = userAgent.match(/Version\/([\d.]+)/)[1];
          } else if (userAgent.indexOf("Opera") > -1) {
            browser.name = "Opera";
            browser.version = userAgent.match(/Opera\/([\d.]+)/)[1];
          } else if (userAgent.indexOf("Edge") > -1) {
            browser.name = "Microsoft Edge";
            browser.version = userAgent.match(/Edge\/([\d.]+)/)[1];
          } else {
            browser.name = "Other";
            browser.version = "";
          }

          browser.version = parseFloat(browser.version);
          if (isNaN(browser.version)) browser.version = "";

          if (userAgent.indexOf("Windows") > -1) {
            os.name = "Windows";
            os.version = userAgent.match(/Windows NT ([\d.]+)/)[1];
          } else if (userAgent.indexOf("Mac") > -1) {
            os.name = "macOS";
            os.version = userAgent
              .match(/Mac OS X ([\d_.]+)/)[1]
              .replace(/_/g, ".");
          } else if (userAgent.indexOf("Android") > -1) {
            os.name = "Android";
            os.version = userAgent.match(/Android ([\d.]+)/)[1];
          } else if (userAgent.indexOf("Linux") > -1) {
            os.name = "Linux";
          } else if (userAgent.indexOf("iOS") > -1) {
            os.name = "iOS";
            os.version = userAgent.match(/OS ([\d_]+)/)[1].replace(/_/g, ".");
          } else {
            os.name = "Other";
            os.version = "";
          }

          os.version = parseFloat(os.version);

          if (os.name === "macOS" && os.version === "10.15") {
            os.version = "X";
          }

          if (isNaN(os.version)) os.version = "";

          // Get device type
          const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
          deviceType = isMobile ? "Mobile" : "Desktop";
        } catch (e) {
          browser = Object.assign({ name: "Other", version: 0 }, browser);
          os = Object.assign({ name: "Unknown", version: 0 }, os);
        }
        const yourDevice = new Html("div")
          .class("card-box", "list", "max")
          .appendMany(
            // OS
            new Html()
              .class("item")
              .appendMany(
                new Html().text(
                  langManager.getString("settings.operatingSystem")
                ),
                new Html()
                  .class("label")
                  .text((os.name + " " + os.version).trim())
              ),
            // Browser
            new Html()
              .class("item")
              .appendMany(
                new Html().text(langManager.getString("settings.webBrowser")),
                new Html()
                  .class("label")
                  .text((browser.name + " " + browser.version).trim())
              ),
            // Device type
            new Html()
              .class("item")
              .appendMany(
                new Html().text(langManager.getString("settings.deviceType")),
                new Html().class("label").text(deviceType)
              ),
            // Protocol
            new Html()
              .class("item")
              .appendMany(
                new Html().text(langManager.getString("settings.webProtocol")),
                new Html().class("label").text(webProtocol)
              ),
            // Host
            new Html()
              .class("item")
              .appendMany(
                new Html().text(langManager.getString("settings.webHost")),
                new Html().class("label").text(webHost)
              )
          )
          .appendTo(wrapperWrapper);
      },
      accounts: () => {
        currentPage = "accounts";
        wrapperWrapper.clear();
        makeSidebar();
        new Html("h1").text("Accounts").appendTo(wrapperWrapper);
        let userData = Accounts.getUserData();
        if (userData.onlineAccount == 0) {
          const loginCardBox = new Html("div")
            .appendMany(
              new Html("img").class("icon").attr({ src: userData.pfp }),
              new Html("div")
                .class("text")
                .appendMany(
                  new Html("div").text("User"),
                  new Html("div").class("label").text("Offline Account")
                )
            )
            .class("card-box", "max")
            .appendTo(wrapperWrapper);
          new Html("button")
            .text("Login with Zeon")
            .class("primary", "mc", "m-2")
            .on("click", async () => {
              let x = await Modal.input(
                "Zeon Login",
                "Please enter your Zeon username",
                "Username...",
                wrapperWrapper,
                false
              );
              if (x !== false) {
                let y = await Modal.input(
                  "Zeon Login",
                  "Please enter your Zeon password",
                  "Password...",
                  wrapperWrapper,
                  true
                );
                if (y !== false) {
                  Accounts.login(x, y).then(async (e) => {
                    console.log(e);
                    console.log(await Accounts.getUserData());
                    pages.accounts();
                  });
                }
              }
            })
            .appendTo(wrapperWrapper);
        } else {
          const loginCardBox = new Html("div")
            .appendMany(
              new Html("img").class("icon").attr({ src: userData.pfp }),
              new Html("div")
                .class("text")
                .appendMany(
                  new Html("div").text(userData.username),
                  new Html("div").class("label").text("Online Account")
                )
            )
            .class("card-box", "max")
            .appendTo(wrapperWrapper);
          makeHeading("h2", "Details");
          const detailsCardBox = new Html("div")
            .appendMany(
              new Html("div")
                .class("text")
                .appendMany(
                  new Html("div").class("label").text("Email"),
                  new Html("div").text(userData.email),
                  new Html("div").class("label").text("Account Type"),
                  new Html("div").text("Online Account"),
                  new Html("div").class("label").text("Account ID"),
                  new Html("div").text(userData.id)
                )
            )
            .class("card-box", "mc")
            .appendTo(wrapperWrapper);
          makeHeading("h2", "Options");
          const optionsCardBox = new Html("div")
            .appendMany(
              new Html("button")
                .class("mc", "small")
                .text("Logout")
                .on("click", async () => {
                  await Accounts.logout();
                  pages.accounts();
                })
            )
            .class("card-box", "mc")
            .appendTo(wrapperWrapper);
        }
      },
      appearence: async () => {
        currentPage = "appearence";
        wrapperWrapper.clear();
        const defaultThemes = [
          new Html("option").text("Dark").attr({
            value: "dark",
            selected: desktopConfig.theme === "dark" ? true : null,
          }),
          new Html("option").text("Light").attr({
            value: "light",
            selected: desktopConfig.theme === "light" ? true : null,
          }),
        ];
        new Html("h1").text("Appearence").appendTo(wrapperWrapper);
        let themeSelectSpan = new Html("span")
          .text("Theme")
          .appendTo(wrapperWrapper);

        const check = await Vfs.whatIs("Root/Pluto/config/themes");

        let themes = [];
        let themeData = {};

        let selectedTheme = "dark.theme";

        if (check === null) {
          // non exist
          themes = defaultThemes;
        } else {
          const themeFileListReal = await Vfs.list("Root/Pluto/config/themes");
          const themeFileList = themeFileListReal
            .filter((r) => r.type === "File" && r.item.endsWith(".theme"))
            .map((r) => r.item);

          await Promise.all(
            themeFileList.map(async (itm) => {
              const theme = await Vfs.readFile(
                `Root/Pluto/config/themes/${itm}`
              );
              const result = ThemeLib.validateTheme(theme);
              if (result.success === true) {
                themes.push({
                  id: itm,
                  item: result.data.name,
                });
                if (desktopConfig.theme === itm) {
                  selectedTheme = itm;
                }
                themeData[itm] = Object.assign({ fileName: itm }, result.data);
              } else {
                alert("failed parsing theme data due to " + result.message);
              }
            })
          );
        }

        console.log(selectedTheme);

        DropDown.new(
          themeSelectSpan,
          themes,
          (e) => {
            // set the option and do the save
            if (e === undefined) {
              return;
            }

            desktopConfig.theme = e;
            ThemeLib.setCurrentTheme(themeData[e]);
            save();
          },
          selectedTheme
        ).class("if", "mc");

        const languageSelectSpan = new Html("span")
          // .class("row", "ac", "js", "gap")
          .text(langManager.getString("settings.language"))
          .appendTo(wrapperWrapper);

        DropDown.new(
          languageSelectSpan,
          langManager.langs.map((l) => {
            // return new Html("button")
            //   .text(langManager.getString("languages." + l))
            //   .on("click", () => {
            //     langManager.setLanguage(l);
            //   });
            return {
              item: langManager.getString("languages." + l),
              id: l,
              selected: desktopConfig.language === l ? true : false,
            };
          }),
          (e) => {
            desktopConfig.language = e;
            alert(e);
            langManager.setLanguage(e);
            save();
          },
          desktopConfig.language,
          "unset"
        ).class("if", "mc");
      },
      network: () => {
        currentPage = "network";
        wrapperWrapper.clear();
        new Html("h1").text("Network").appendTo(wrapperWrapper);
      },
      applications: async () => {
        currentPage = "applications";
        wrapperWrapper.clear();
        new Html("h1").text("Applications").appendTo(wrapperWrapper);
        makeHeading("h2", "Registered Packages");
        const cardBox = new Html("div")
          .class("card-box", "list", "mc")
          .appendMany(
            new Html("div").class("item").text("Registered Packages"),
            new Html("div")
              .class("label")
              .text(Root.RegisteredApps.size + " packages")
          )
          .appendTo(wrapperWrapper);

        Root.RegisteredApps.forEach((app) => {
          new Html("div")
            .class("item")
            .appendMany(
              new Html("div").text(app.name),
              new Html("div").class("label").text(app.url)
            )
            .appendTo(cardBox);
        });
        makeHeading("h2", "Local Applications");
        const localApps = new Html("div")
          .class("card-box", "list", "mc")
          .appendMany(
            new Html("div").class("item").text("Local Applications"),
            new Html("div")
              .class("label")
              .text(
                (await Vfs.list("Root/Pluto/apps")).filter((app) =>
                  String(app.item).endsWith(".app")
                ).length + " applications"
              )
          )
          .appendTo(wrapperWrapper);

        const appList = (await Vfs.list("Root/Pluto/apps"))
          .filter((app) => String(app.item).endsWith(".app"))
          .forEach((app) => {
            new Html("div")
              .class("item")
              .appendMany(
                new Html("div").text(app.item),
                new Html("div").class("label").text(app.type)
              )
              .appendTo(localApps);
          });
      },
      security: async () => {
        async function performSecurityScan() {
          let dc = await CodeScanner.scanForDangerousCode();
          table.clear();

          new Html("thead")
            .appendMany(
              new Html("tr").appendMany(
                new Html("th").text(
                  langManager.getString("settings.securityTableItemName")
                ),
                new Html("th").text(
                  langManager.getString("settings.securityTableItemSafe")
                ),
                new Html("th").text(
                  langManager.getString("settings.securityTableItemDelete")
                )
              )
            )
            .appendTo(table);

          console.log(dc, dc.length, 0 < dc.length, 1 < dc.length);

          for (let i = 0; i < dc.length; i++) {
            if (dc[i].success) {
              new Html("tbody")
                .appendMany(
                  new Html("tr").appendMany(
                    new Html("td").text(dc[i].filename),
                    new Html("td").text(
                      dc[i].dangerous === true
                        ? langManager.getString("actions.no")
                        : langManager.getString("actions.yes")
                    ),
                    new Html("td").appendMany(
                      dc[i].dangerous === true
                        ? new Html("button")
                            .text(langManager.getString("Filesystem.delete"))
                            .on("click", async (_) => {
                              await dc[i].delete();
                              await performSecurityScan();
                            })
                        : new Html("button")
                            .attr({ disabled: true })
                            .text(langManager.getString("Filesystem.delete"))
                    )
                  )
                )
                .appendTo(table);
            }
          }
        }
        // await this.clear("security");
        wrapperWrapper.clear();
        // makeAlert("warning", "This section is currently not finished.");
        makeHeading("h1", langManager.getString("settings.security"));
        let table = new Html("table")
          .class("w-100")
          .appendMany()
          .appendTo(wrapperWrapper);
        new Html("button")
          .text(langManager.getString("settings.securityCheck"))
          .class("primary", "mc", "small")
          .on("click", async (_) => performSecurityScan())
          .appendTo(wrapperWrapper);

        let settingsConfig = JSON.parse(
          await Vfs.readFile("Root/Pluto/config/settingsConfig.json")
        );
        console.log(settingsConfig);
        if (settingsConfig === null) {
          await Vfs.writeFile(
            "Root/Pluto/config/settingsConfig.json",
            `{"warnSecurityIssues": true}`
          );
          settingsConfig = JSON.parse(
            await Vfs.readFile("Root/Pluto/config/settingsConfig.json")
          );
        }

        new Html("span")
          .appendMany(
            new Html("input")
              .attr({
                type: "checkbox",
                id: Root.PID + "lc",
                checked: settingsConfig.warnSecurityIssues,
              })
              .on("input", async (e) => {
                settingsConfig.warnSecurityIssues = e.target.checked;
                await Vfs.writeFile(
                  "Root/Pluto/config/settingsConfig.json",
                  JSON.stringify(settingsConfig)
                );
              }),
            new Html("label")
              .attr({
                for: Root.PID + "lc",
              })
              .text(langManager.getString("settings.securityCheckEveryStartup"))
          )
          .appendTo(wrapperWrapper);
      },
    };

    makeSidebar();
    pages.accounts();
    document.addEventListener("pluto.lang-change", (e) => {
      pages[currentPage]();
      win.setTitle(langManager.getString("settings.name"));
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
