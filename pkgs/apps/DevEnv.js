import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/Icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import FileDialog from "../../libs/FileDialog.js";
import langManager from "../../libs/l10n/manager.js";
import MenuBar from "../../components/MenuBar.js";
import { css } from "../../libs/templates.js";
let wrapper; // Lib.html | undefined
let DvWindow;
let editorSize = 14;

export default {
  name: langManager.getString("devenv.name"),
  type: "app",
  privs: 1,
  start: async function (Root) {


    await Vfs.importFS();


    DvWindow = new Ws.data.win({
      title: langManager.getString("devenv.systemApp_DevEnv"),
      content:
        '<div class="col fc h-100">DevEnv is loading external libraries, please wait...</div>',
      width: 540,
      height: 420,
      pid: Root.PID,
      onclose: async () => {
        if (currentDocument.dirty === true) {
          let result = await Modal.prompt(
            "Warning",
            "You have unsaved changes, are you sure you want to exit?",
            DvWindow.window
          );
          if (result !== true) {
            return false;
          }
        }
        Root.End();
      },
    });

    wrapper = DvWindow.window.querySelector(".win-content");

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
      "../../assets/prettier/standalone.mjs"
    );
    increaseCount();
    const prettierPluginBabel = (
      await import("../../assets/prettier/plugins/babel.mjs")
    ).default;
    increaseCount();
    const prettierPluginEsTree = (
      await import("../../assets/prettier/plugins/estree.mjs")
    ).default;
    increaseCount();

    console.log(prettier, prettierPluginBabel, prettierPluginEsTree);

    const DvDefaultSettings = {
      wordWrap: true,
      fontSize: 14,
      templateApp: true,
      prettifyOnSave: true,
      liveAutocomplete: true,
      useMenuBar: false,
    };

    let DvSettings = DvDefaultSettings;

    async function DvSaveSettings() {
      await Vfs.writeFile(
        "Registry/DvSettings.json",
        JSON.stringify(DvSettings)
      );
      await DvReadSettings();
    }
    async function DvReadSettings() {
      if ((await Vfs.exists("Registry/DvSettings.json")) !== false) {
        DvSettings = Object.assign(
          DvDefaultSettings,
          JSON.parse(await Vfs.readFile("Registry/DvSettings.json"))
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

    function modal(
      info,
      isHtml = false,
      title = langManager.getString("devenv.appHelp")
    ) {
      return new Promise((res, _rej) => {
        Modal.modal(title, info, wrapper, isHtml, {
          text: langManager.getString("actions.ok"),
          callback: (_) => {
            res(true);
          },
        });
      });
    }

    // let extensionsWindow = null;

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
            langManager.getString("devenv.error")
          );
          return;
        }

        if (currentDocument.path.endsWith(".app")) {
          const code = editor.getValue()
          const modifiedCode = code.replace(/"\.\//g, `"${window.location.href}`);
          console.log(modifiedCode)
          Root.Packages.startFromURL(
            URL.createObjectURL(
              new Blob([modifiedCode], { type: "application/javascript" })
            ),
            [],
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
              langManager.getString("devenv.error")
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
            langManager.getString("devenv.error")
          );
        }
      },
      help: async () => {
        function modal(info, isHtml = false) {
          return new Promise((res, _rej) => {
            Modal.modal(
              langManager.getString("devenv.appHelp"),
              info,
              wrapper,
              isHtml,
              {
                text: langManager.getString("actions.ok"),
                callback: (_) => {
                  res(true);
                },
              }
            );
          });
        }

        if (
          (await Modal.prompt(
            langManager.getString("devenv.appHelp"),
            langManager.getString("devenv.appHelp_intro"),
            wrapper
          )) === false
        ) {
          return;
        }

        await modal(langManager.getString("devenv.appHelp_string1"));
        await modal(langManager.getString("devenv.appHelp_string2"));

        if (
          (await Modal.prompt(
            langManager.getString("devenv.appHelp"),
            langManager.getString("devenv.appHelp_string3"),
            wrapper
          )) === true
        ) {
          await modal(
            new Html("div").html(/*html*/ `${langManager.getString(
              "devenv.appHelp_string4"
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
      <td>${langManager.getString("devenv.action_newDocument")}</td>
    </tr>
    <tr>
      <td>CTRL + O</td>
      <td>${langManager.getString("devenv.action_openDocument")}</td>
    </tr>
    <tr>
      <td>CTRL + S</td>
      <td>${langManager.getString("devenv.action_save")}</td>
    </tr>
    <tr>
      <td>CTRL + -</td>
      <td>${langManager.getString("devenv.action_zoomOut")}</td>
    </tr>
    <tr>
      <td>CTRL + =</td>
      <td>${langManager.getString("devenv.action_zoomIn")}</td>
    </tr>
    <tr>
      <td>CTRL + SHIFT + S</td>
      <td>${langManager.getString("devenv.action_format")}</td>
    </tr>
    <tr>
      <td>CTRL + Enter</td>
      <td>${langManager.getString("devenv.action_runApp")}</td>
    </tr>
    <tr>
      <td>CTRL + ,</td>
      <td>${langManager.getString("devenv.action_aceSettings")}</td>
    </tr>
    <tr>
      <td>CTRL + .</td>
      <td>${langManager.getString("devenv.systemApp_Settings")}</td>
    </tr>
    <tr>
      <td>CTRL + Space</td>
      <td>${langManager.getString("devenv.action_showAutocomplete")}</td>
    </tr>
  </tbody>
</table>
`),
            true
          );
        }

        await modal(langManager.getString("devenv.thankYou"));
      },
      viewDocs: async () => {
        const docsWindow = new Ws.data.win({
          title: langManager.getString("devenv.Documentation"),
          content: '<iframe src="./docs/README.html">',
          pid: Root.PID,
          width: 400,
          height: 360,
        });

        Html
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
                  .text(langManager.getString(`settings_${key}`))
              );
            case "string":
              return new Html("span").appendMany(
                new Html("label")
                  .attr({
                    for: Root.PID + key + num,
                  })
                  .text(langManager.getString(`settings_${key}`)),
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
                  .text(langManager.getString(`settings_${key}`)),
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
                langManager.getString(`settings_${key}`)
              );
          }
        });

        modal(
          new Html("div").class("col", "gap").appendMany(...settingsInfo),
          true,
          langManager.getString("devenv.systemApp_Settings")
        );
      },
      // manageExtensions: async () => {
      //   if (extensionsWindow !== null) {
      //     return extensionsWindow.focus();
      //   }

      //   extensionsWindow = new Win({
      //     title: langManager.getString("devenv.manageExtensions"),
      //     content:
      //       '<div class="row fc h-100">DevEnv is looking for extensions, please wait...</div>',
      //     pid: Root.PID,
      //     width: 400,
      //     height: 360,
      //     onclose: () => {
      //       extensionsWindow = null;
      //     },
      //   });

      //   const extensionsFolderExists = await Vfs.whatIs(
      //     "Root/Pluto/config/DvExtensions"
      //   );

      //   if (
      //     extensionsFolderExists === null ||
      //     extensionsFolderExists === "file"
      //   ) {
      //     await Vfs.createFolder("Root/Pluto/config/DvExtensions");
      //   }

      //   const fileList = await Vfs.list("Root/Pluto/config/DvExtensions");

      //   const extensionList = fileList.filter(
      //     (f) => f.type === "file" && f.item.endsWith(".dvx")
      //   );

      //   if (extensionList.length > 0) {
      //     extensionList.forEach((e) => {
      //       new Html('div').text(e.item);
      //     });
      //   } else {

      //   }
      // },
    };

    /**
     * Keyboard shortcut handler for DevEnv.
     * @param {KeyboardEvent} e Handle keyboard event.
     */
    async function keyBindHandler(e) {
      const focusState = DvWindow.window.classList.contains("focus");

      if (!focusState) return;
      if (e.repeat) return;

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            // Alt + N = New document (as CTRL + N can't be bound)
            e.preventDefault();
            actionHandlers.newDocument();
            break;
        }
      }

      // somewhat working macOS command key support
      if (e.ctrlKey || e.metaKey) {
        if (
          (e.ctrlKey && e.shiftKey && e.key === "S") ||
          (e.metaKey && e.shiftKey && e.key === "S")
        ) {
          // Ctrl + Shift + S
          e.preventDefault();
          actionHandlers.prettify();
          return;
        }

        switch (e.key.toLowerCase()) {
          case "o":
            // Ctrl + O = Open
            e.preventDefault();
            actionHandlers.openFile();
            break;
          case "s":
            // Ctrl + S = Save
            e.preventDefault();
            if (DvSettings.prettifyOnSave === true) {
              await actionHandlers.prettify();
            }
            actionHandlers.save();
            break;
          case "enter":
            // Ctrl + Enter = Run
            e.preventDefault();
            actionHandlers.run();
            break;
          case "-":
            // Ctrl + - = Zoom Out
            e.preventDefault();
            actionHandlers.zoomOut();
            break;
          case "=":
            // Ctrl + = Zoom In
            e.preventDefault();
            actionHandlers.zoomIn();
            break;
          case ".":
            // Ctrl + . = Settings
            e.preventDefault();
            actionHandlers.settings();
            break;
        }
      }
    }

    window.addEventListener("keydown", keyBindHandler);

    wrapper.innerHTML = "";
    wrapper.classList.add("col", "o-h", "h-100");

    let currentDocument = {
      path: "",
      dirty: false,
    };

    const updateTitle = (_) => {
      // Display title
      DvWindow.window.querySelector(".win-titlebar .title").innerText = `${
        currentDocument.dirty === true ? "•" : ""
      } DevEnv - ${
        currentDocument.path === ""
          ? "Untitled"
          : currentDocument.path.split("/").pop()
      }`.trim();

      // Correct language mode
      if (currentDocument.path === "") {
        editor.session.setMode("ace/mode/typescript");
      } else {
        const dots = currentDocument.path.split(".");
        if (dots.length > 0) {
          let currentFileExtension = dots.pop();
          if (currentFileExtension in appFileTypes) {
            editor.session.setMode(
              `ace/mode/${appFileTypes[currentFileExtension]}`
            );
          } else {
            editor.session.setMode("ace/mode/plain_text");
          }
        }
      }
    };
    function newDocument(path, content) {
      currentDocument.path = path;
      currentDocument.dirty = false;
      updateTitle();
      // just to be sure (instead of using .text() as that was sometimes not working)
      editor.setValue(content, -1);
    }

    // FileDialog.pickFile and FileDialog.saveFile both take path as an argument and are async
    async function openFile() {
      let file = await FileDialog.pickFile(
        (await Vfs.getParentFolder(currentDocument.path)) || "Root"
      );
      if (file === false) return;
      let content = await Vfs.readFile(file);
      newDocument(file, content);
      DvWindow.focus();
    }
    async function saveFile() {
      // make sure the path is not unreasonable
      if (currentDocument.path === "") {
        let result = await FileDialog.saveFile(
          (await Vfs.getParentFolder(currentDocument.path)) || "Root"
        );
        if (result === false) return false;
        currentDocument.path = result;
      }
      await Vfs.writeFile(currentDocument.path, editor.getValue());
      currentDocument.dirty = false;
      updateTitle();
    }

    async function dirtyCheck() {
      if (currentDocument.dirty === true) {
        let result = await Modal.prompt(
          "Warning",
          "You have unsaved changes, are you sure you want to proceed?",
          DvWindow.window
        );
        if (result !== true) {
          return false;
        }
      }
      return true;
    }

    let sidebarWrapper = new Html("div")
      .styleJs({ display: "flex" })
      .appendTo(wrapper);


    const appFileTypes = {
      app: "typescript",
      css: "css",
      html: "html",
      pml: "html",
      xml: "xml",
      js: "typescript",
    };
    const defaultFileType = null;

    // let extensionsList = [];

    function makeSidebar() {
      sidebarWrapper.clear();

      if (DvSettings.useMenuBar === true) {
        wrapper.classList.add("iframe", "col");
        wrapper.classList.remove("with-sidebar", "row");
        MenuBar.new(sidebarWrapper, [
          {
            item: langManager.getString("devenv.menuFile"),
            items: [
              {
                icon: icons.newFile,
                item: langManager.getString("devenv.action_newDocument"),
                key: "Alt + N",
                select() {
                  actionHandlers.newDocument();
                },
              },
              {
                icon: icons.openFolder,
                item: langManager.getString("devenv.action_openDocument"),
                key: "Ctrl + O",
                select() {
                  actionHandlers.openFile();
                },
              },
              {
                icon: icons.save,
                item: langManager.getString("devenv.action_save"),
                key: "Ctrl + S",
                select() {
                  actionHandlers.save();
                },
              },
              { type: "separator" },
              {
                icon: icons.run,
                item: langManager.getString("devenv.action_runApp"),
                key: "CTRL + Enter",
                select() {
                  actionHandlers.run();
                },
              },
            ],
          },
          {
            item: langManager.getString("devenv.menuEdit"),
            items: [
              {
                icon: icons.sparkles,
                item: langManager.getString("devenv.action_format"),
                key: "Ctrl + Shift + S",
                select() {
                  actionHandlers.prettify();
                },
              },
              {
                icon: icons.wrench,
                item: langManager.getString("devenv.systemApp_Settings"),
                key: "Ctrl + .",
                select() {
                  actionHandlers.settings();
                },
              },
            ],
          },
          {
            item: langManager.getString("devenv.menuView"),
            items: [
              {
                icon: icons.zoomIn,
                item: langManager.getString("devenv.action_zoomIn"),
                key: "Ctrl + -",
                select() {
                  actionHandlers.zoomIn();
                },
              },
              {
                icon: icons.zoomOut,
                item: langManager.getString("devenv.action_zoomOut"),
                key: "Ctrl + =",
                select() {
                  actionHandlers.zoomOut();
                },
              },
            ],
          },
          // {
          //   item: langManager.getString("devenv.menuExtensions"),
          //   items: [
          //     {
          //       icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20.1508" cy="14.3551" rx="3.84906" ry="3.81308" fill="white"/><ellipse cx="9.96234" cy="3.81308" rx="3.84906" ry="3.81308" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 6.29716C0 5.2968 0.810956 4.48584 1.81132 4.48584H17.8868C18.8872 4.48584 19.6981 5.2968 19.6981 6.29716V22.1885C19.6981 23.1889 18.8872 23.9998 17.8868 23.9998H13.7517C13.7909 23.7815 13.8114 23.5567 13.8114 23.3271C13.8114 21.2212 12.0881 19.514 9.96234 19.514C7.83656 19.514 6.11328 21.2212 6.11328 23.3271C6.11328 23.5567 6.13376 23.7815 6.173 23.9998H1.81132C0.810955 23.9998 0 23.1889 0 22.1885V18.1422C0.14844 18.1594 0.299462 18.1682 0.452572 18.1682C2.57835 18.1682 4.30163 16.4611 4.30163 14.3552C4.30163 12.2493 2.57835 10.5421 0.452572 10.5421C0.299462 10.5421 0.14844 10.5509 0 10.5682V6.29716Z" fill="white"/></svg>`,
          //       item: langManager.getString("devenv.manageExtensions"),
          //       select() {
          //         actionHandlers.manageExtensions();
          //       },
          //     },
          //     ...extensionsList,
          //   ],
          // },
          {
            item: langManager.getString("devenv.menuHelp"),
            items: [
              {
                icon: icons.book,
                item: langManager.getString("devenv.appDocumentation"),
                select() {
                  actionHandlers.viewDocs();
                },
              },
              {
                icon: icons.help,
                item: langManager.getString("devenv.appHelp"),
                select() {
                  actionHandlers.help();
                },
              },
            ],
          },
        ]);
      } else {
        wrapper.classList.remove("iframe", "col");
        wrapper.classList.add("with-sidebar", "row");
        Sidebar.new(sidebarWrapper, [
          {
            onclick: actionHandlers.newDocument,
            html: icons.newFile,
            title: langManager.getString("devenv.action_newDocument"),
          },
          {
            onclick: actionHandlers.openFile,
            html: icons.openFolder,
            title: langManager.getString("devenv.action_openDocument"),
          },
          {
            onclick: actionHandlers.save,
            html: icons.save,
            title: langManager.getString("devenv.action_save"),
          },
          {
            onclick: actionHandlers.zoomIn,
            html: icons.zoomIn,
            title: langManager.getString("devenv.action_zoomIn"),
          },
          {
            onclick: actionHandlers.zoomOut,
            html: icons.zoomOut,
            title: langManager.getString("devenv.action_zoomOut"),
          },
          {
            onclick: actionHandlers.prettify,
            html: icons.sparkles,
            title: langManager.getString("devenv.action_format"),
          },
          {
            onclick: actionHandlers.help,
            html: icons.help,
            title: langManager.getString("devenv.appHelp"),
          },
          {
            onclick: actionHandlers.viewDocs,
            html: icons.book,
            title: langManager.getString("devenv.appDocumentation"),
          },
          {
            onclick: actionHandlers.settings,
            html: icons.wrench,
            title: langManager.getString("devenv.systemApp_Settings"),
          },
        ]);
      }
    }
    makeSidebar();

    let text = new Html("div").class("fg", "col").appendTo(wrapper);

    let textWrapper = new Html("div")
      .style({ height: "100%" })
      .appendTo(text);

    var editor = window.ace.edit(textWrapper.elm);
    // Custom theme
    editor.setOptions({
      enableBasicAutocompletion: true,
    });
    editor.setShowPrintMargin(false);
    editor.session.setTabSize(2);
    editor.session.setUseSoftTabs(true);
    editor.session.setUseWrapMode(true);
    editor.session.setMode("ace/mode/typescript");

    const editorRef = text.qs(".ace_editor");

    if (editorRef) {
      editorRef.classOn("fg", "row");
    }

    let statusBar = new Html("div")
      .styleJs({
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        textAlign: "right",
        background: "var(--unfocused)",
        flexShrink: 0,
        minHeight: "1.4rem",
        padding: "0.25rem 1rem",
        gap: "1rem",
      })
      .appendTo(text);

    let statusBarRunAppButton = new Html("button")
      .class("row", "ac", "gap-small", "transparent")
      .style({
        margin: "0 auto 0 0",
        padding: "0.2em 0.75em",
      })
      .appendMany(
        new Html("i")
          .class("icon")
          .style({ width: "16px", height: "16px" })
          .html(icons.run),
        new Html("span").text(langManager.getString("devenv.action_runApp"))
      )
      .on("click", () => {
        actionHandlers.run();
      })
      .appendTo(statusBar);

    let statusBarLineColNumber = new Html("span")
        .text("Ln 0")
        .appendTo(statusBar),
      statusBarTerminalOption = new Html("button")
        .class("row", "ac", "gap-small", "transparent")
        .style({
          margin: "0",
          padding: "0.2em 0.75em",
        })
        .appendMany(
          new Html("span")
            .class("icon")
            .style({ width: "16px", height: "16px" })
            .html(icons.terminal),
          new Html("span").text(
            langManager.getString("devenv.systemApp_Terminal")
          )
        )
        .on("click", () => {
          Root.Packages.Run("apps:Terminal");
        })
        .appendTo(statusBar);

    await DvReadSettings();

    function updateStatusBar() {
      let cursor = editor.selection.getCursor();
      let selectionRange = editor.getSelectedText().length;

      let text = `${langManager.getString("devenv.line")} ${
        cursor.row + 1
      }, ${langManager.getString("devenv.column")} ${cursor.column + 1}`;

      if (selectionRange > 0) {
        text += `&nbsp;(${selectionRange} selected)`;
      }

      statusBarLineColNumber.html(text);
    }

    text.on("input", (e) => {
      currentDocument.dirty = true;
      updateTitle();
    });

    editor.session.selection.on("changeCursor", (e) => {
      updateStatusBar();
    });
    editor.session.selection.on("changeSelection", (e) => {
      updateStatusBar();
    });

    let defaultText = "";

    if (DvSettings.templateApp === true) {
      defaultText = `tba`;
    }

    newDocument("", defaultText);

    if (Root.Arguments.data) {
      let content = await Vfs.readFile(Root.Arguments.data.path);
      newDocument(Root.Arguments.data.path, content);
    }

    document.addEventListener("pluto.lang-change", (e) => {
      DvWindow.setTitle(langManager.getString("devenv.systemApp_DevEnv"));
      // Root.Lib.updateProcTitle(langManager.getString("devenv.systemApp_DevEnv"));
      // makeSidebar();
      statusBarRunAppButton.elm.querySelector("span").textContent =
        langManager.getString("devenv.action_runApp");
    });

    // return Root.Lib.setupReturns(async (m) => {
    //   if (m && m.type) {
    //     if (m.type === "refresh") {
    //       langManager.getString = m.data;
    //       DvWindow.setTitle(langManager.getString("devenv.systemApp_DevEnv"));
    //       Root.Lib.updateProcTitle(langManager.getString("devenv.systemApp_DevEnv"));
    //       makeSidebar();
    //       statusBarRunAppButton.elm.querySelector("span").textContent =
    //         langManager.getString("devenv.action_runApp");
    //     }
    //   }
      if (typeof Root.Arguments === "object" && Root.Arguments.type && Root.Arguments.type === "loadFile" && Root.Arguments.path) {
        newDocument(Root.Arguments.path, await Vfs.readFile(Root.Arguments.path));
      }
    // });
  },

  end: async function () {
    // Close the window when the process is exited
    DvWindow.close();
    window.removeEventListener("keydown", keyBindHandler);

    return true;
  },
};
