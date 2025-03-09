let L = {};
let C = {};

import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/Icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import { css } from "../../libs/templates.js";
import langManager from "./l10n/manager.js";

export default {
  name: "File Dialog Library",
  description: "Create file dialogs to pick and select files",
  ver: "v1.6.2", // Supports minimum Core version of v1.6.2
  type: "library",
  init: (l, c) => {
    L = l;
    C = c;
  },
  pickFile: async (path) => {
    if (path === undefined || path === "") path = "Root";
    return new Promise(async (resolve, reject) => {
      let win = new Ws.data.win({
        title: "File Dialog",
        content: "",
        width: 450,
        height: 360,
        onclose: () => {
          resolve(false);
        },
      });

      const setTitle = (t) =>
        (win.window.querySelector(".win-titlebar .title").innerText = t);

      let wrapper = win.window.querySelector(".win-content");

      wrapper.classList.add("row", "o-h", "h-100", "with-sidebar");

      Sidebar.new(wrapper, [
        {
          onclick: async (_) => {
            let p = await Vfs.getParentFolder(path);
            path = p;
            renderFileList(p);
          },
          html: icons.arrowUp,
          title: "Parent Directory",
        },
      ]);

      let isClosing = false;

      const wrapperWrapper = new Html("div")
        .class("col", "w-100", "ovh")
        .appendTo(wrapper);
      const wrapperWrapperWrapper = new Html("div")
        .class("fg", "w-100", "ovh")
        .appendTo(wrapperWrapper);

      const attemptClose = async (_) => {
        if (!isClosing) {
          isClosing = true;
          await win.close();
        }
      };

      const table = new Html("table")
        .class("w-100", "ovh")
        .appendTo(wrapperWrapperWrapper);
      const buttonRow = new Html("div").class("row").appendTo(wrapperWrapper);

      let confirmButton = new Html("button")
        .class("primary")
        .text(langManager.getString("actions.confirm"))
        .style({ "margin-left": "auto" })
        .attr({ disabled: true })
        .on("click", async (_) => {
          await attemptClose();
          return resolve(selectedItem);
        });
      let cancelButton = new Html("button")
        .text("Cancel")
        .on("click", async (_) => {
          await attemptClose();
          resolve(false);
        });

      buttonRow.appendMany(confirmButton, cancelButton);

      await Vfs.importFS();

      let selectedItem = "";

      let tableHead = new Html("thead").appendTo(table);
      let tableHeadRow = new Html("tr").appendTo(tableHead);
      new Html("th").attr({ colspan: 2 }).text("Name").appendTo(tableHeadRow);
      new Html("th").text("Type").appendTo(tableHeadRow);

      let tableBody = new Html("tbody").appendTo(table);

      async function renderFileList(folder) {
        console.error(folder);
        const isFolder = await Vfs.whatIs(folder);

        if (isFolder !== "Folder") {
          path = "Root/Desktop";
          return await renderFileList();
        }

        setTitle("File picker - " + folder);
        let fileList = await Vfs.list(folder);

        const mappings = await Promise.all(
          fileList.map(async (e) => {
            return await FileMappings.retrieveAllMIMEdata(path + "/" + e.item);
          })
        );

        tableBody.html("");

        for (let i = 0; i < fileList.length; i++) {
          let file = fileList[i];
          let tableBodyRow = new Html("tr").appendTo(tableBody);

          async function selectItem() {
            if (selectedItem === path + "/" + file.item) {
              if (file.type === "Folder") {
                selectedItem = path + "/" + file.item;
                confirmButton.attr({ disabled: "" });
                path = selectedItem;
                renderFileList(path);
              } else {
                selectedItem = path + "/" + file.item;
                await attemptClose();
                return resolve(selectedItem);
              }

              return;
            }
            selectedItem = path + "/" + file.item;
            if (file.type === "file") {
              confirmButton.attr({ disabled: null });
            }
            if (file.type === "Folder") {
              confirmButton.attr({ disabled: "" });
            }
            renderFileList(path);
          }

          tableBodyRow.on("mousedown", selectItem);
          tableBodyRow.on("touchstart", selectItem);

          const mapping = mappings[i];

          if (file === null) continue;

          if (selectedItem === path + "/" + file.item)
            tableBodyRow.class("table-selected");

          let userFriendlyFileType = "File";

          switch (file.type) {
            case "Folder":
              userFriendlyFileType = "File folder";
              break;
            case "file":
              userFriendlyFileType = mapping.fullName || mapping.label;
              break;
          }

          new Html("td")
            .style({ width: "24px", height: "24px" })
            .append(
              new Html("div")
                .html(
                  mapping.icon in icons ? icons[mapping.icon] : mapping.icon
                )
                .style({ width: "24px" })
            )
            .appendTo(tableBodyRow);
          new Html("td").text(file.item).appendTo(tableBodyRow);
          new Html("td").text(userFriendlyFileType).appendTo(tableBodyRow);
        }
      }
      // async function renderFileList(folder) {
      //   const isFolder = await Vfs.whatIs(folder);

      //   if (isFolder !== "Folder") {
      //     path = "Root/Desktop";
      //     return await renderFileList();
      //   }

      //   // return renderFileList(await Vfs.getParentFolder(folder));

      //   setTitle("File picker - " + folder);
      //   let fileList = await Vfs.list(folder);

      //   tableBody.html("");

      //   for (let i = 0; i < fileList.length; i++) {
      //     let file = fileList[i];
      //     let tableBodyRow = new Html("tr").appendTo(tableBody);
      //     tableBodyRow.on("click", async (_) => {
      //       if (selectedItem === path + "/" + file.item) {
      //         if (file.type === "Folder") {
      //           selectedItem = path + "/" + file.item;
      //           confirmButton.attr({ disabled: "" });
      //           path = selectedItem;
      //           renderFileList(path);
      //         } else {
      //           selectedItem = path + "/" + file.item;
      //           await attemptClose();
      //           return resolve(selectedItem);
      //         }

      //         return;
      //       }
      //       selectedItem = path + "/" + file.item;
      //       if (file.type === "file") {
      //         confirmButton.attr({ disabled: null });
      //       }
      //       if (file.type === "Folder") {
      //         confirmButton.attr({ disabled: "" });
      //       }
      //       renderFileList(path);
      //     });
      //     let mapping = FileMappings.retrieveAllMIMEdata(
      //       path + "/" + file.item,
      //       Vfs
      //     );

      //     if (file === null) continue;

      //     if (selectedItem === path + "/" + file.item)
      //       tableBodyRow.class("table-selected");

      //     let userFriendlyFileType = "File";

      //     switch (file.type) {
      //       case "Folder":
      //         userFriendlyFileType = "File folder";
      //         break;
      //       case "file":
      //         userFriendlyFileType = mapping.fullName || mapping.label;
      //         break;
      //     }

      //     new Html("td")
      //       .style({ width: "24px", height: "24px" })
      //       .append(
      //         new Html("div")
      //           .html(mapping.icon in icons ? icons[mapping.icon] : mapping.icon)
      //           .style({ width: "24px" })
      //       )
      //       .appendTo(tableBodyRow);
      //     new Html("td").text(file.item).appendTo(tableBodyRow);
      //     new Html("td").text(userFriendlyFileType).appendTo(tableBodyRow);
      //   }
      // }

      renderFileList(path);
    });
  },
  saveFile: (path) => {
    if (path === undefined || path === "") path = "Root";
    return new Promise(async (resolve, reject) => {
      let win = new Ws.data.win({
        title: "File Dialog",
        content: "",
        width: 450,
        height: 360,
        onclose: () => {
          resolve(false);
        },
      });

      const setTitle = (t) =>
        (win.window.querySelector(".win-titlebar .title").innerText = t);

      let wrapper = win.window.querySelector(".win-content");

      wrapper.classList.add("row", "o-h", "h-100", "with-sidebar");

      Sidebar.new(wrapper, [
        {
          onclick: async (_) => {
            let p = await Vfs.getParentFolder(path);
            path = p;
            renderFileList(p);
          },
          html: icons.arrowUp,
          title: "Parent Directory",
        },
      ]);

      let isClosing = false;

      const wrapperWrapper = new Html("div")
        .class("col", "w-100")
        .appendTo(wrapper);
      const wrapperWrapperWrapper = new Html("div")
        .class("fg", "w-100", "ovh")
        .appendTo(wrapperWrapper);

      const attemptClose = async (_) => {
        if (!isClosing) {
          isClosing = true;
          await win.close();
        }
      };

      const table = new Html("table")
        .class("w-100")
        .appendTo(wrapperWrapperWrapper);
      const buttonRow = new Html("div").class("row").appendTo(wrapperWrapper);

      let pathInput = new Html("input")
        .class("fg")
        .attr({ placeholder: "Path", value: path + "/" || "Root/" })
        .on("keydown", async (e) => {
          if (e.key === "Enter") {
            await attemptClose();
            return resolve(selectedItem);
          }
        })
        .on("keyup", async (e) => {
          let toBeSavedItem = e.target.value;
          if (!toBeSavedItem.startsWith("Root/")) e.target.value = "Root/";
          setSelectedItem(toBeSavedItem);
        });
      pathInput.elm.focus();
      pathInput.elm.select();

      let confirmButton = new Html("button")
        .class("primary")
        .text(langManager.getString("actions.confirm"))
        .attr({ disabled: true })
        .on("click", async (_) => {
          await attemptClose();
          return resolve(selectedItem);
        });
      let cancelButton = new Html("button")
        .text("Cancel")
        .on("click", async (_) => {
          await attemptClose();
          resolve(false);
        });

      buttonRow.appendMany(pathInput, confirmButton, cancelButton);

      await Vfs.importFS();

      let selectedItem = "";

      function setSelectedItem(newPath) {
        selectedItem = newPath;
        if (pathInput.getValue() !== newPath) pathInput.val(newPath);
        confirmButton.attr({ disabled: newPath === "" ? "" : null });
      }
      let tableHead = new Html("thead").appendTo(table);
      let tableHeadRow = new Html("tr").appendTo(tableHead);
      new Html("th").text("Name").attr({ colspan: 2 }).appendTo(tableHeadRow);
      new Html("th").text("Type").appendTo(tableHeadRow);

      let tableBody = new Html("tbody").appendTo(table);

      async function renderFileList(folder) {
        const isFolder = await Vfs.whatIs(folder);

        if (isFolder !== "Folder") {
          path = "Root/Desktop";
          return await renderFileList();
        }

        setTitle("File picker - " + folder);
        let fileList = await Vfs.list(folder);

        const mappings = await Promise.all(
          fileList.map(async (e) => {
            return await FileMappings.retrieveAllMIMEdata(path + "/" + e.item);
          })
        );

        tableBody.html("");

        for (let i = 0; i < fileList.length; i++) {
          let file = fileList[i];
          let tableBodyRow = new Html("tr").appendTo(tableBody);

          async function selectItem() {
            if (selectedItem === path + "/" + file.item) {
              if (file.type === "Folder") {
                selectedItem = path + "/" + file.item;
                setSelectedItem(selectedItem);
                confirmButton.attr({ disabled: "" });
                path = selectedItem;
                renderFileList(path);
              } else {
                selectedItem = path + "/" + file.item;
                setSelectedItem(selectedItem);
                await attemptClose();
                return resolve(selectedItem);
              }

              return;
            }
            selectedItem = path + "/" + file.item;
            setSelectedItem(selectedItem);
            if (file.type === "file") {
              confirmButton.attr({ disabled: null });
            }
            if (file.type === "Folder") {
              confirmButton.attr({ disabled: "" });
            }
            renderFileList(path);
          }

          tableBodyRow.on("mousedown", selectItem);
          tableBodyRow.on("touchstart", selectItem);

          const mapping = mappings[i];

          if (file === null) continue;

          if (selectedItem === path + "/" + file.item)
            tableBodyRow.class("table-selected");

          let userFriendlyFileType = "File";

          switch (file.type) {
            case "Folder":
              userFriendlyFileType = "File folder";
              break;
            case "file":
              userFriendlyFileType = mapping.fullName || mapping.label;
              break;
          }

          new Html("td")
            .style({ width: "24px", height: "24px" })
            .append(
              new Html("div")
                .html(
                  mapping.icon in icons ? icons[mapping.icon] : mapping.icon
                )
                .style({ width: "24px" })
            )
            .appendTo(tableBodyRow);
          new Html("td").text(file.item).appendTo(tableBodyRow);
          new Html("td").text(userFriendlyFileType).appendTo(tableBodyRow);
        }
      }

      renderFileList(path);
    });
  },
};
