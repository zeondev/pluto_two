import Ws from "../../libs/windowSystem.js";
import Html from "../../libs/html.js";
import { css } from "../../libs/templates.js";
import icons from "../../components/icons.js";
import semver from "../../assets/semver.min.js";
import Modal from "../../libs/Modal.js";
import Vfs from "../../libs/vfs.js";

let wrapper; // Lib.html | undefined
let MyWindow;
let server = "https://zeondev.github.io/PlutoTwo-AppStore/";

const pkg = {
  name: "thats-the.name",
  type: "app",
  privs: 1,
  style: css`
    .appstore-front-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-gap: 10px;
    }

    .appstore-app {
      border-radius: 5px;
      border: 1px solid var(--outline);
      padding: 5px;
      margin: 0px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      background-color: var(--root);
    }

    .appstore-app img {
      width: 50%;
      border-radius: 5px;
    }

    .appstore-app * {
      margin: 5px;
    }
    .backbutton {
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      border-radius: 5px;
      color: var(--text);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      height: max-content;
      position: fixed;
      top: 50px;
      left: 20px;
    }

    .backbutton:hover {
      background-color: var(--neutral);
    }

    .banner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      background-color: var(--unfocused);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      height: 200px;
      border-radius: 5px;
    }

    .banner img {
      width: 180px;
      height: 180px;
      border-radius: 5px;
    }
    .infotext {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      width: 100%;
      gap: 5px;
    }
    .infolowertext {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      padding: 10px;
      width: 100%;
      gap: 5px;
    }
    .appstore-div {
      padding: 10px;
    }
  `,
  start: async function (Root) {
    let listing = await fetch(server + "/listing_new.json").then((res) =>
      res.json()
    );

    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    MyWindow = new Ws.data.win({
      title: "App Store",
      pid: Root.PID,
      width: 800,
      height: 600,
      onclose: () => {
        Root.End();
      },
    });

    // Get the window body
    wrapper = MyWindow.window.querySelector(".win-content");
    wrapper = Html.from(wrapper);
    console.log(wrapper);

    const asFilePath = "Registry/AppStore";
    let asIndex
    if (await Vfs.exists("Registry/AppStore/_AppStoreIndex.json")) {
      asIndex = JSON.parse(await Vfs.readFile("Registry/AppStore/_AppStoreIndex.json"))
    } else {
      asIndex = {}
    }

    async function updateAsIndex() {
      if ((await Vfs.whatIs("Registry/AppStore")) === null) {
        await Vfs.createFolder("Registry/AppStore");
      }

      const apps = await Vfs.list("Registry/AppStore");

      console.log(apps);

      await Vfs.writeFile(
        "Registry/AppStore/_AppStoreIndex.json",
        JSON.stringify(asIndex)
      );
    }

    updateAsIndex();

    let install = async (pkg, app, force = false) => {
      let appNameSafe = pkg.replace(/\//g, "--");
      let fileExtension = "." + app.assets.path.split(".").pop();
      if (fileExtension === ".js") fileExtension = ".app";

      await fetch(
        `${server}pkgs/${pkg}/${app.assets.path}?t=` + performance.now()
      )
        .then(async (e) => {
          console.log(
            await Vfs.whatIs(`${asFilePath}/${appNameSafe}${fileExtension}`)
          );
          if (
            (await Vfs.whatIs(
              `${asFilePath}/${appNameSafe}${fileExtension}`
            )) === null ||
            force == true
          ) {
            let result = await e.text();

            await Vfs.writeFile(
              `${asFilePath}/${appNameSafe}${fileExtension}`,
              result
            );

            const img = await new Promise((resolve, reject) => {
              fetch(`${server}pkgs/${pkg}/${app.assets.icon}`)
                .then((response) => response.blob())
                .then((blob) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const dataURL = reader.result;
                    resolve(dataURL);
                  };
                  reader.readAsDataURL(blob);
                })
                .catch((error) => {
                  reject(error);
                });
            });

            asIndex[appNameSafe] = Object.assign(app, { icon: img });

            // update as index
            await updateAsIndex();

            // pages[currentPage](app);
            return;
          } else if (
            (await Vfs.whatIs(
              `${asFilePath}/${appNameSafe}${fileExtension}`
            )) === "File"
          ) {
            if (fileExtension === ".app") {
              const code = await Vfs.readFile(
                `${asFilePath}/${appNameSafe}${fileExtension}`
              );
              const modifiedCode = code.replace(
                /"\.\//g,
                `"${window.location.href}`
              );
              console.log(modifiedCode);
              Root.Packages.startFromURL(
                URL.createObjectURL(
                  new Blob([modifiedCode], { type: "application/javascript" })
                ),
                [],
                // URL.createObjectURL(["data:text/javascript," + encodeURIComponent(`/*${currentDocument.path}*/` +editor.getValue())], {type:'text/plain'}),
                false
              );
            } else {
              // let x = await Root.Core.startPkg("apps:PML", true, true);
              // x.proc.send({
              //   type: "loadFile",
              //   path: `${asFilePath}/${appNameSafe}${fileExtension}`,
              // });
            }
          }
        })
        .catch((e) => {
          Modal.alert(
            "Notice",
            `Something went wrong while installing the app. ${e}`,
            wrapper
          );
        });
    };

    let currentPage = "front";
    let pages = {
      front: async () => {
        wrapper.clear();
        let appstoregrid = new Html("div")
          .class("appstore-front-grid")
          .appendTo(wrapper);

        listing.forEach(async (app) => {
          let appHash = await fetch(
            `${server}pkgs/${app.id}/${app.assets.path}?t=` + performance.now()
          ).then(async (e) => {
            return new window.Hashes.MD5().hex(await e.text());
          });
          let localHash = new window.Hashes.MD5().hex(
            await Vfs.readFile(
              `${asFilePath}/${app.id.replace(/\//g, "--")}${".app"}`
            )
          );

          ((await Vfs.exists(
            `${asFilePath}/${app.id.replace(/\//g, "--")}${".app"}`
          )) &&
          (await Vfs.readFile(
            `${asFilePath}/${app.id.replace(/\//g, "--")}${".app"}`
          ) == ""))
            ? (localHash = "" )
            : ((await Vfs.whatIs(`${asFilePath}/${app.id.replace(/\//g, "--")}${".app"}`) == null) ? appHash = localHash : localHash = localHash);
          new Html("button")
            .class("appstore-app")
            .appendMany(
              new Html("img").attr({
                src: server + "/pkgs/" + app.id + "/" + app.assets.icon,
                alt: app.name,
              }),
              new Html("h2").text(app.name),
              new Html("p").text(app.shortDescription),
              appHash == localHash
                ? new Html("button")
                    .text(
                      (await Vfs.whatIs(
                        `${asFilePath}/${app.id.replace(/\//g, "--")}${".app"}`
                      )) === "File"
                        ? "Open"
                        : "Install"
                    )
                    .class("primary")
                    .on("click", async () => {
                      await install(app.id, app);
                      pages["front"]();
                    })
                : new Html("button")
                    .class("warning")
                    .text("Update")
                    .on("click", async () => {
                      await install(info.id, info, true);
                      pages["storepage"](info);
                    })
            )
            .on("click", (e) => {
              currentPage = "storepage";
              pages[currentPage](app);
            })
            .appendTo(appstoregrid);
        });
      },
      storepage: async (info) => {
        wrapper.clear();
        new Html("span")
          .class("backbutton")
          .html(icons.back)
          .on("click", () => {
            currentPage = "front";
            pages[currentPage]();
          })
          .appendTo(wrapper);
          let appHash = await fetch(
            `${server}pkgs/${info.id}/${info.assets.path}?t=` + performance.now()
          ).then(async (e) => {
            return new window.Hashes.MD5().hex(await e.text());
          });
          let localHash = new window.Hashes.MD5().hex(
            await Vfs.readFile(
              `${asFilePath}/${info.id.replace(/\//g, "--")}${".app"}`
            )
          );

          ((await Vfs.exists(
            `${asFilePath}/${info.id.replace(/\//g, "--")}${".app"}`
          )) &&
          (await Vfs.readFile(
            `${asFilePath}/${info.id.replace(/\//g, "--")}${".app"}`
          ) == ""))
            ? (localHash = "" )
            : ((await Vfs.whatIs(`${asFilePath}/${info.id.replace(/\//g, "--")}${".app"}`) == null) ? appHash = localHash : localHash = localHash);
        new Html("div")
          .class("banner")
          .appendMany(
            new Html("img").attr({
              src: server + "/pkgs/" + info.id + "/" + info.assets.icon,
              alt: info.name,
            })
          )
          .appendTo(wrapper);
        new Html("div")
          .class("infotext")
          .appendMany(
            new Html("div")
              .style({ width: "75%" })
              .appendMany(
                new Html("h1")
                  .style({ "font-size": "1.7rem" })
                  .text(info.name)
                  .class("h1")
                  .appendTo(wrapper),
                new Html("span").text(info.description)
              ),
            (await Vfs.whatIs(
              `${asFilePath}/${info.id.replace(/\//g, "--")}${".app"}`
            )) === "File"
              ? new Html("Button").text("Remove").on("click", async () => {
                  await Vfs.delete(
                    `${asFilePath}/${info.id.replace(/\//g, "--")}${".app"}`
                  );
                  pages["storepage"](info);
                })
              : new Html("div"),
            appHash == localHash
              ? new Html("button")
                  .text(
                    (await Vfs.whatIs(
                      `${asFilePath}/${info.id.replace(/\//g, "--")}${".app"}`
                    )) === "File"
                      ? "Open"
                      : "Install"
                  )
                  .class("primary")
                  .on("click", async () => {
                    await install(info.id, info);
                    pages["storepage"](info);
                  })
              : new Html("button")
                  .class("warning")
                  .text("Update")
                  .on("click", async () => {
                    await install(info.id, info, true);
                    pages["storepage"](info);
                  })
          )
          .appendTo(wrapper);
        new Html("div")
          .class("appstore-div")
          .appendMany(
            new Html("h1").text("What's new?"),
            new Html("span")
              .class("label")
              .text("Version " + info.versions[0].ver),
            new Html("p").text(info.latestVersionInfo)
          )
          .appendTo(wrapper);

        new Html("h1")
          .text("More info")
          .style({ "padding-left": "10px" })
          .appendTo(wrapper);
        new Html("div")
          .class("infolowertext")
          .appendMany(
            new Html("div")
              .class("card")
              .style({ width: "50%", height: "max-content" })
              .appendMany(
                new Html("span")
                  .class("h3")
                  .style({ "padding-bottom": "5px" })
                  .text("Compatibility"),
                new Html("span")
                  .style({ display: "flex", "align-items": "center" })
                  .class(
                    semver.satisfies(
                      Root.Core.Details.version,
                      ">=" + info.compatibleWith
                    )
                      ? "success"
                      : "danger"
                  )
                  .html(
                    "<span style='padding-right:5px;'>" +
                      (semver.satisfies(
                        Root.Core.Details.version,
                        ">=" + info.compatibleWith
                      )
                        ? icons.circleCheck
                        : icons.circleExclamation) +
                      " </span>" +
                      (semver.satisfies(
                        Root.Core.Details.version,
                        ">=" + info.compatibleWith
                      )
                        ? "Compatible"
                        : "Not Compatible")
                  ),
                new Html("span")
                  .class("label")
                  .text(
                    "Requires v" +
                      info.compatibleWith +
                      ". Currently running " +
                      Root.Core.Details.version
                  )
              ),
            new Html("div")
              .class("card")
              .style({ width: "50%", height: "max-content" })
              .appendMany(
                new Html("span")
                  .class("h3")
                  .style({ "padding-bottom": "5px" })
                  .text("Versions"),
                new Html("div")
                  .class("fg", "row", "w-100", "fc")
                  .appendMany(
                    new Html("span").text(info.versions[0].ver),
                    new Html("span")
                      .class("ml-auto", "label")
                      .text(
                        new Date(info.versions[0].date).toLocaleDateString()
                      )
                  ),
                new Html("details").appendMany(
                  new Html("summary").text("See older versions of this app"),
                  ...info.versions.slice(1).map((v) => {
                    return new Html("div")
                      .class("fg", "row", "w-100", "fc")
                      .appendMany(
                        new Html("span").text(v.ver),
                        new Html("span")
                          .class("ml-auto", "label")
                          .text(new Date(v.date).toLocaleDateString())
                      );
                  })
                )
              )
          )
          .appendTo(wrapper);
      },
    };

    pages[currentPage]();
  },
  end: async function () {
    // Close the window when the process is exited
    MyWindow.close();
  },
};

export default pkg;
