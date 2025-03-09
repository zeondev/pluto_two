// var esp = await fetch("https://wttr.in/alton?format=j1");

import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/Icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import FileDialog from "../../libs/FileDialog.js";
import langManager from "../../libs/l10n/manager.js";
import MenuBar from "../../components/MenuBar.js";
import { css } from "../../libs/templates.js";

let win;

const pkg = {
  name: langManager.getString("devenv.name"),
  type: "app",
  privs: 0,
  style: css`
    .weather {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `,

  start: async function (Root) {
    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    win = new Ws.data.win({
      title: langManager.getString("devenv.name"),
      width: 512,
      height: 348,
    });



    let wrapper = win.window.querySelector(".win-content");
    wrapper.classList.add("o-h", "col", "h-100", "w-100");

    function loadScript(url, scriptId) {
        return new Promise((resolve) => {
          if (Html.qs('script[id="' + scriptId + '"]')) {
            return resolve(false);
          }
  
          new Html("script")
            .attr({ id: scriptId, src: url })
            .on("load", () => {
              resolve(true);
            })
            .appendTo("head");
        });
      }
  
      let counter = new Html("div")
        .text("0 / 5")
        .appendTo(wrapper.querySelector(".col"));
  
      let count = 0;
      function increaseCount() {
        count++;
        counter.text(`${count} / 5`);
      }
  
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.22.0/ace.min.js",
        "ace"
      );
      increaseCount();
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.22.0/ext-language_tools.js",
        "ace_language_tools"
      );
      increaseCount();
  
      // import * as prettier from "https://unpkg.com/prettier@3.2.4/standalone.mjs";
      // import prettierPluginBabel from "https://unpkg.com/prettier@3.2.4/plugins/babel.mjs";
      // import prettierPluginEsTree from "https://unpkg.com/prettier@3.2.4/plugins/estree.mjs";
  
      const prettier = await import(
        "https://unpkg.com/prettier@3.2.4/standalone.mjs"
      );
      increaseCount();
      const prettierPluginBabel = (
        await import("https://unpkg.com/prettier@3.2.4/plugins/babel.mjs")
      ).default;
      increaseCount();
      const prettierPluginEsTree = (
        await import("https://unpkg.com/prettier@3.2.4/plugins/estree.mjs")
      ).default;
      increaseCount();

      
    const DvDefaultSettings = {
        wordWrap: true,
        fontSize: 14,
        templateApp: true,
        prettifyOnSave: true,
        liveAutocomplete: true,
      };
  
      let DvSettings = DvDefaultSettings;
  
      async function DvSaveSettings() {
        await vfs.writeFile(
          "Registry/DvSettings.json",
          JSON.stringify(DvSettings)
        );
        await DvReadSettings();
      }

      async function DvReadSettings() {
        if ((await vfs.exists("Registry/DvSettings.json")) !== false) {
          DvSettings = Object.assign(
            DvDefaultSettings,
            JSON.parse(await vfs.readFile("Registry/DvSettings.json"))
          );
        } else {
          await DvSaveSettings();
          // first-time help
          actionHandlers.help();
        }
  
        if (DvSettings["wordWrap"] !== undefined) {
          if (typeof DvSettings["wordWrap"] === "boolean") {
            editor.session.setUseWrapMode(DvSettings["wordWrap"]);
          }
        }
        if (DvSettings["fontSize"] !== undefined) {
          if (typeof DvSettings["fontSize"] === "number") {
            textWrapper.style({
              "font-size": DvSettings["fontSize"] + "px",
            });
          }
        }
  
        if (DvSettings["liveAutocomplete"] !== undefined) {
          if (typeof DvSettings["liveAutocomplete"] === "boolean") {
            editor.setOptions({
              enableLiveAutocompletion: DvSettings["liveAutocomplete"],
            });
          }
        }
        makeSidebar();
      }

      const actionHandlers = {
        newDocument: async () => {
          // clicking the new document button seems buggy, possibly due to dirty check
          const result = await dirtyCheck();
          if (result === false) return;
          newDocument("", "");
        },
        openFile: async () => {
          const result = await dirtyCheck();
          if (result === false) return;
          openFile();
        },
        save: async () => {
          await saveFile();
        },
        zoomIn: async () => {
          editorSize += 2;
          textWrapper.style({
            "font-size": editorSize.toString() + "px",
          });
          DvSettings.fontSize = Number(editorSize.toString());
          DvSaveSettings();
        },
        zoomOut: async () => {
          editorSize -= 2;
          textWrapper.style({
            "font-size": editorSize.toString() + "px",
          });
          DvSettings.fontSize = Number(editorSize.toString());
          DvSaveSettings();
        },
        run: async () => {
          if (currentDocument.dirty === true) {
            modal(
              new Html("div").appendMany(
                new Html("span").text(
                  "You have unsaved changes. Save your work before running the app."
                )
              ),
              true,
              Root.Lib.getString("error")
            );
            return;
          }
  
          if (currentDocument.path.endsWith(".app")) {
            Root.Core.startPkg(
              URL.createObjectURL(
                new Blob([editor.getValue()], { type: "application/javascript" })
              ),
              // URL.createObjectURL(["data:text/javascript," + encodeURIComponent(`/*${currentDocument.path}*/` +editor.getValue())], {type:'text/plain'}),
              false
            );
          } else if (currentDocument.path.endsWith(".pml")) {
            let x = await Root.Core.startPkg("apps:PML", true, true);
            x.proc.send({
              type: "loadFile",
              path: currentDocument.path,
            });
          }
        },
        prettify: async () => {
          try {
            if (
              currentDocument.path.endsWith(".js") === false &&
              currentDocument.path.endsWith(".ts") === false &&
              currentDocument.path.endsWith(".app") === false &&
              currentDocument.path !== ""
            ) {
              modal(
                new Html("div").appendMany(
                  new Html("span").html(
                    "You currently cannot format a file of this type. Use <code>.js</code>, <code>.ts</code>, or <code>.app</code> file extensions for formatting support."
                  )
                ),
                true,
                Root.Lib.getString("error")
              );
              return;
            }
            const formatted = await prettier.format(editor.getValue(), {
              parser: "babel",
              plugins: [prettierPluginBabel, prettierPluginEsTree],
            });
  
            editor.setValue(formatted, 1);
            currentDocument.dirty = true;
            updateTitle();
          } catch (e) {
            modal(
              new Html("div").appendMany(
                new Html("span").text("An error occurred while formatting:"),
                new Html("pre").text(e.message)
              ),
              true,
              Root.Lib.getString("error")
            );
          }
        },
        help: async () => {
          function modal(info, isHtml = false) {
            return new Promise((res, _rej) => {
              Root.Modal.modal(
                Root.Lib.getString("appHelp"),
                info,
                wrapper,
                isHtml,
                {
                  text: Root.Lib.getString("ok"),
                  callback: (_) => {
                    res(true);
                  },
                }
              );
            });
          }
  
          if (
            (await Root.Modal.prompt(
              Root.Lib.getString("appHelp"),
              Root.Lib.getString("appHelp_intro"),
              wrapper
            )) === false
          ) {
            return;
          }
  
          await modal(Root.Lib.getString("appHelp_string1"));
          await modal(Root.Lib.getString("appHelp_string2"));
  
          if (
            (await Root.Modal.prompt(
              Root.Lib.getString("appHelp"),
              Root.Lib.getString("appHelp_string3"),
              wrapper
            )) === true
          ) {
            await modal(
              new Root.Lib.html("div").html(/*html*/ `${Root.Lib.getString(
                "appHelp_string4"
              )}
  <table>
    <thead>
      <tr>
        <th>Key</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody style="margin-top:0.5em">
      <tr>
        <td>ALT + N</td>
        <td>${Root.Lib.getString("action_newDocument")}</td>
      </tr>
      <tr>
        <td>CTRL + O</td>
        <td>${Root.Lib.getString("action_openDocument")}</td>
      </tr>
      <tr>
        <td>CTRL + S</td>
        <td>${Root.Lib.getString("action_save")}</td>
      </tr>
      <tr>
        <td>CTRL + -</td>
        <td>${Root.Lib.getString("action_zoomOut")}</td>
      </tr>
      <tr>
        <td>CTRL + =</td>
        <td>${Root.Lib.getString("action_zoomIn")}</td>
      </tr>
      <tr>
        <td>CTRL + SHIFT + S</td>
        <td>${Root.Lib.getString("action_format")}</td>
      </tr>
      <tr>
        <td>CTRL + Enter</td>
        <td>${Root.Lib.getString("action_runApp")}</td>
      </tr>
      <tr>
        <td>CTRL + ,</td>
        <td>${Root.Lib.getString("action_aceSettings")}</td>
      </tr>
      <tr>
        <td>CTRL + .</td>
        <td>${Root.Lib.getString("systemApp_Settings")}</td>
      </tr>
      <tr>
        <td>CTRL + Space</td>
        <td>${Root.Lib.getString("action_showAutocomplete")}</td>
      </tr>
    </tbody>
  </table>
  `),
              true
            );
          }
  
          await modal(Root.Lib.getString("thankYou"));
        },
        viewDocs: async () => {
          const docsWindow = new Win({
            title: Root.Lib.getString("Documentation"),
            content: '<iframe src="./docs/README.html">',
            pid: Root.PID,
            width: 400,
            height: 360,
          });
  
          Root.Lib.html
            .from(docsWindow.window.querySelector(".win-content"))
            .classOn("iframe")
            .style({ padding: "0px" });
        },
        settings: async () => {
          const settingsInfo = Object.keys(DvSettings).map((key, num) => {
            switch (typeof DvSettings[key]) {
              case "boolean":
                return new Html("span").appendMany(
                  new Html("input")
                    .attr({
                      type: "checkbox",
                      id: Root.PID + key + num,
                      checked: DvSettings[key] === true ? "true" : undefined,
                    })
                    .on("input", (e) => {
                      DvSettings[key] = e.target.checked;
  
                      DvSaveSettings();
                    }),
                  new Html("label")
                    .attr({
                      for: Root.PID + key + num,
                    })
                    .text(Root.Lib.getString(`settings_${key}`))
                );
              case "string":
                return new Html("span").appendMany(
                  new Html("label")
                    .attr({
                      for: Root.PID + key + num,
                    })
                    .text(Root.Lib.getString(`settings_${key}`)),
                  new Html("input")
                    .attr({
                      type: "text",
                      id: Root.PID + key + num,
                      value:
                        DvSettings[key] !== undefined
                          ? DvSettings[key]
                          : undefined,
                    })
                    .on("input", (e) => {
                      DvSettings[key] = e.target.value;
  
                      DvSaveSettings();
                    })
                );
              case "number":
                return new Html("span").appendMany(
                  new Html("label")
                    .attr({
                      for: Root.PID + key + num,
                    })
                    .text(Root.Lib.getString(`settings_${key}`)),
                  new Html("input")
                    .attr({
                      type: "number",
                      id: Root.PID + key + num,
                      value:
                        DvSettings[key] !== undefined
                          ? DvSettings[key]
                          : undefined,
                    })
                    .style({
                      "max-width": "4rem",
                    })
                    .on("input", (e) => {
                      let n = parseInt(e.target.value);
                      if (n < 0) {
                        n = 0;
                      }
  
                      DvSettings[key] = n;
  
                      DvSaveSettings();
                    })
                );
              case "bigint":
              case "symbol":
              case "undefined":
              case "object":
              case "function":
                return new Html("span").text(
                  Root.Lib.getString(`settings_${key}`)
                );
            }
          });
  
          modal(
            new Html("div").class("col", "gap").appendMany(...settingsInfo),
            true,
            Root.Lib.getString("systemApp_Settings")
          );
        },
      };



    document.addEventListener("pluto.lang-change", (e) => {
      win.setTitle(langManager.getString("weather.name"));
    });

  },
  end: async function () {
    // Close the window when the process is exited
    win.close();
    return true;
  },
};

export default pkg;
