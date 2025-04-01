import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/Icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import FileDialog from "../../libs/FileDialog.js";
import langManager from "../../libs/l10n/manager.js";

let win;

const pkg = {
  name: langManager.getString("notepad.name"),
  type: "app",
  privs: 0,
  start: async function (Root) {
    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    win = new Ws.data.win({
      title: langManager.getString("notepad.name"),
      width: 312,
      height: 248,
      onclose: () => {
        Root.End();
      },
    });

    // let setTitle = (t) =>
    //   (win.window.querySelector(".win-titlebar .title").innerText = t);

    let wrapper = win.window.querySelector(".win-content");
    wrapper.classList.add("with-sidebar", "o-h", "row", "h-100");

    let path = "Root";

    let sidebarWrapper = new Html("div")
      .styleJs({ display: "flex" })
      .appendTo(wrapper);

    let currentDocument = {
      path: "",
      dirty: false,
    };

    const updateTitle = (_) =>
      (win.window.querySelector(".win-titlebar .title").innerText = `${
        currentDocument.dirty === true ? "•" : ""
      } ${langManager.getString("notepad.name")} - ${
        currentDocument.path === ""
          ? "Untitled"
          : currentDocument.path.split("/").pop()
      }`.trim());

    function newDocument(path, content) {
      currentDocument.path = path;
      currentDocument.dirty = false;
      updateTitle();
      // just to be sure (instead of using .text() as that was sometimes not working)
      text.elm.textContent = content;
      text.elm.scrollTop = 0;
    }

    // FileDialog.pickFile and FileDialog.saveFile both take path as an argument and are async
    async function openFile() {
      let file = await FileDialog.pickFile(
        (await Vfs.getParentFolder(currentDocument.path)) || "Root"
      );
      if (file === false) return;
      let content = await Vfs.readFile(file);
      newDocument(file, content);
      win.focus();
    }
    async function saveFile() {
      // make sure the path is not unreasonable
      if (currentDocument.path === "") {
        return saveAs();
      }
      await Vfs.writeFile(currentDocument.path, text.elm.value);
      currentDocument.dirty = false;
      updateTitle();
    }
    async function saveAs() {
      let result = await FileDialog.saveFile(
        (await Vfs.getParentFolder(currentDocument.path)) || "Root"
      );
      if (result === false) return false;
      console.error(currentDocument, result);
      await Vfs.createFile(result);
      await Vfs.writeFile(result, text.elm.value);

      currentDocument.dirty = false;
      currentDocument.path = result;
      updateTitle();
    }

    async function dirtyCheck() {
      if (currentDocument.dirty === true) {
        let result = await Root.Modal.prompt(
          "Warning",
          "You have unsaved changes, are you sure you want to proceed?",
          win.window
        );
        if (result !== true) {
          return false;
        }
      }
      return true;
    }

    function makeSidebar() {
      sidebarWrapper.clear();
      Sidebar.new(sidebarWrapper, [
        {
          onclick: async (_) => {
            // clicking the new document button seems buggy, possibly due to dirty check
            const result = await dirtyCheck();
            if (result === false) return;
            newDocument("", "");
          },
          html: icons.newFile,
          title: langManager.getString("notepad.newDocument"),
        },
        {
          onclick: async (_) => {
            const result = await dirtyCheck();
            if (result === false) return;
            openFile();
          },
          html: icons.openFolder,
          title: langManager.getString("notepad.openDocument"),
        },
        {
          onclick: async (_) => {
            await saveFile();
          },
          html: icons.save,
          title: langManager.getString("notepad.save"),
        },
        {
          onclick: async (_) => {
            await saveAs();
          },
          html: icons.saveAll,
          title: langManager.getString("notepad.saveAs"),
        },
        {
          style: {
            "margin-top": "auto",
          },
          onclick: (_) => {
            alert("Not implemented");
          },
          html: icons.help,
          title: langManager.getString("appHelp"),
        },
      ]);
    }

    const wrapperWrapper = new Html("div")
      .class("col", "w-100", "ovh")
      .appendTo(wrapper);
    let text = new Html("textarea")
      .class("h-100", "fg", "w-100", "ovh", "transparent", "container")
      .attr({ placeholder: langManager.getString("notepad.placeholder") })
      .appendTo(wrapperWrapper);

    makeSidebar();

    if (Root.Arguments.data) {
      let content = await Vfs.readFile(Root.Arguments.data.path);
      newDocument(Root.Arguments.data.path, content);
    }

    document.addEventListener("pluto.lang-change", (e) => {
      win.setTitle(langManager.getString("notepad.name"));
      text.attr({ placeholder: langManager.getString("notepad.placeholder") });
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
