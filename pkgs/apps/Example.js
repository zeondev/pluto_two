import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import { css } from "../../libs/templates.js";

let win;

const pkg = {
  name: "Welcome",
  type: "app",
  privs: 1,
  style: css``,
  start: async function (Root) {
    console.log(Ws.data);

    const appName = "File Manager";
    win = new Ws.data.win({
      title: "Compatibility",
      icon: "/assets/pluto-logo.svg",
      width: 400,
      height: 400,
    });

    const setTitle = (t) =>
      (win.window.querySelector(".win-titlebar .title").innerText = t);

    let wrapper = win.window.querySelector(".win-content");
    wrapper.classList.add("with-sidebar", "o-h", "row", "h-100");

    let path = "Root";

    let sidebarWrapper = new Html("div")
      .styleJs({ display: "flex" })
      .appendTo(wrapper);

    function makeSidebar() {
      sidebarWrapper.clear();
      Sidebar.new(sidebarWrapper, [
        {
          onclick: async (_) => {
            if (path === "Root") return;

            let p = await Vfs.getParentFolder(path);
            path = p;
            renderFileList(p);
          },
          html: icons.arrowUp,
          title: "Up a directory",
        },
        {
          onclick: async (_) => {
            let result = await Modal.input(
              "Input",
              "New folder name",
              "New folder"
            );
            if (result === false) return;
            result = result.replace(/\//g, "");
            await Vfs.createFolder(path + "/" + result);
            renderFileList(path);
          },
          html: icons.createFolder,
          title: "Create Folder",
        },
        {
          onclick: async (_) => {
            let result = await Modal.input(
              "Input",
              "New file name",
              "New file"
            );
            if (result === false) return;
            result = result.replace(/\//g, "");
            await Vfs.writeFile(path + "/" + result, "");
            renderFileList(path);
          },
          html: icons.createFile,
          title: "Create File",
        },
        {
          onclick: async (_) => {
            let result = await Modal.input(
              "Go to Folder",
              "Enter folder path",
              "Path",
              wrapper,
              false,
              path
            );
            if (result === false) return;
            path = result;
            renderFileList(path);
          },
          html: icons.dir,
          title: "Go to Folder",
        },
        {
          onclick: async (_) => {
            if (!selectedItem) return;
            let i = await Vfs.whatIs(selectedItem);
            if (i === "Folder")
              return Modal.alert(
                "Error",
                "Folder download is not yet supported.",
                wrapper
              );
            let text = await Vfs.readFile(selectedItem, undefined);

            if (text.startsWith("blob:")) {
              var element = document.createElement("a");
              element.setAttribute("href", text);
              element.setAttribute("download", selectedItem.split("/").pop());
              element.style.display = "none";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);

              renderFileList(path);
              return;
            }

            // boilerplate download code
            var element = document.createElement("a");
            element.setAttribute(
              "href",
              "data:text/plain;charset=utf-8," + encodeURIComponent(text)
            );
            element.setAttribute("download", selectedItem.split("/").pop());
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            renderFileList(path);
          },
          html: icons.download,
          title: "Download File",
        },
        {
          onclick: (_) => {
            var input = new Html("input").elm;
            input.type = "file";

            input.onchange = (e) => {
              // getting a hold of the file reference
              var file = e.target.files[0];
              var reader = new FileReader();

              if (
                file.type.startsWith("image") ||
                file.type.startsWith("audio") ||
                file.type.startsWith("video")
              ) {
                console.log(file);
                // read as arraybuffer; store as base64
                // reader.readAsDataURL(file);
                reader.readAsArrayBuffer(file);

                // here we tell the reader what to do when it's done reading...
                reader.onload = async (readerEvent) => {
                  // var content = readerEvent.target.result; // this is the content!
                  const blob = new Blob([readerEvent.target.result], {
                    type: file.type,
                  });

                  const filePath = `${Root.Lib.randomString()}-${file.name}`;

                  await localforage.setItem(filePath, blob);

                  await Vfs.writeFile(
                    `${path}/${file.name}`,
                    `vfsImport:${filePath}`
                  );

                  renderFileList(path);
                };
              } else {
                // read as text
                reader.readAsText(file, "UTF-8");

                // here we tell the reader what to do when it's done reading...
                reader.onload = async (readerEvent) => {
                  var content = readerEvent.target.result; // this is the content!

                  const filePath = `${Root.Lib.randomString()}-${file.name}`;

                  await localforage.setItem(filePath, content);

                  await Vfs.writeFile(
                    `${path}/${file.name}`,
                    `vfsImport:${filePath}`
                  );

                  renderFileList(path);
                };
              }
            };

            input.click();
          },
          html: icons.upload,
          title: "Upload File from Host",
        },
        {
          onclick: async (_) => {
            if (!selectedItem) return;
            let i = await Vfs.whatIs(selectedItem);
            let result = await Modal.prompt(
              "Notice",
              `Are you sure you want to delete this ${
                i === "Folder" ? "folder" : "file"
              }?`
            );
            if (result === true) {
              await Vfs.delete(selectedItem);
              renderFileList(path);
            }
          },
          html: icons.delete,
          title: "Delete File",
        },
      ]);
    }

    const wrapperWrapper = new Html("div")
      .class("col", "w-100", "ovh")
      .appendTo(wrapper);
    const wrapperWrapperWrapper = new Html("div")
      .class("fg", "w-100")
      .appendTo(wrapperWrapper);

    makeSidebar();

    wrapperWrapperWrapper.on("contextmenu", (e) => {
      if (e.target.closest("tr")) return;
      e.preventDefault();

      ctxMenu.new(e.clientX, e.clientY, [
        {
          item: "Copy path",
          async select() {
            let x = new Html("textarea").val(path);
            // Select the text field
            x.elm.select();
            x.elm.setSelectionRange(0, 99999); // For mobile devices

            // Copy the text inside the text field
            navigator.clipboard.writeText(x.getValue());
          },
        },
      ]);
    });

    const table = new Html("table")
      .class("w-100")
      .appendTo(wrapperWrapperWrapper);

    await Vfs.importFS();

    let selectedItem = "";

    let tableHead = new Html("thead").appendTo(table);
    let tableHeadRow = new Html("tr").appendTo(tableHead);
    new Html("th").attr({ colspan: 2 }).text("Name").appendTo(tableHeadRow);
    new Html("th").text("Type").appendTo(tableHeadRow);

    let tableBody = new Html("tbody").appendTo(table);

    async function renderFileList(folder) {
      const isFolder = await Vfs.whatIs(folder);
      console.log(isFolder, "i is a folder");
      if (isFolder === null || isFolder !== "Folder") {
        path = "Root";
        console.log("re rendering");
        return renderFileList(path);
      }

      setTitle(appName + " - " + folder);
      let fileList = await Vfs.list(folder);
      let mappings;
      if (fileList !== null) {
        mappings = await Promise.all(
          fileList.map(async (e) => {
            return await FileMappings.retrieveAllMIMEdata(path + "/" + e.item);
          })
        );
      } else {
        path = "Root/";
        return renderFileList(path);
      }

      tableBody.html("");

      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        let tableBodyRow = new Html("tr").appendTo(tableBody);
        const mapping = mappings[i];

        tableBodyRow.on("contextmenu", (e) => {
          e.preventDefault();
          ctxMenu.new(e.clientX, e.clientY, [
            {
              item: "Open",
              async select() {
                mapping.onClick(Root.Core);
              },
            },
            mapping.ctxMenuApp !== undefined
              ? {
                  item: `Open in ${Root.Lib.getString(
                    mapping.ctxMenuApp.name
                  )}`,
                  async select() {
                    const p = await Root.Core.startPkg(
                      mapping.ctxMenuApp.launch,
                      true,
                      true
                    );
                    p.proc.send({
                      type: "loadFile",
                      path: path + "/" + file.item,
                    });
                  },
                }
              : null,
            {
              item: "Copy path",
              async select() {
                let x = new Html("textarea").val(path + "/" + file.item);
                // Select the text field
                x.elm.select();
                x.elm.setSelectionRange(0, 99999); // For mobile devices

                // Copy the text inside the text field
                navigator.clipboard.writeText(x.getValue());
              },
            },
            {
              item: "Rename",
              async select() {
                let result = await Modal.input(
                  "Rename File",
                  `Rename ${file.item} to...`,
                  file.item,
                  wrapper,
                  false,
                  file.item
                );
                // clean result
                result = result.replace(/\//g, "");
                await Vfs.rename(`${path}/${file.item}`, `${result}`);
                renderFileList(path);
              },
            },
            {
              item: "Delete",
              async select() {
                await Vfs.delete(`${path}/${file.item}`);
              },
            },
          ]);
        });

        async function handleClick() {
          if (selectedItem === path + "/" + file.item) {
            if (file.type === "Folder") {
              selectedItem = path + "/" + file.item;
              path = selectedItem;
              renderFileList(path);
            } else {
              mapping.onClick(Root.Core);
            }

            return;
          }
          selectedItem = path + "/" + file.item;
          renderFileList(path);
        }

        tableBodyRow.on("mousedown", (e) => {
          if (e.button === 0) handleClick();
        });
        tableBodyRow.on("touchstart", handleClick);

        if (file === null) continue;

        if (selectedItem === path + "/" + file.item)
          tableBodyRow.class("table-selected");

        let userFriendlyFileType = "File";

        switch (file.type) {
          case "Folder":
            userFriendlyFileType = "Folder";
            break;
          case "file":
            userFriendlyFileType = mapping.fullName || mapping.label;
            break;
        }

        if (mapping.icon === "Folder") {
          mapping.icon = "folder";
        }

        if (mapping.icon === "File") {
          mapping.icon = "file";
        }

        new Html("td")
          .style({ width: "24px", height: "24px" })
          .append(
            new Html("div")
              .html(mapping.icon in icons ? icons[mapping.icon] : mapping.icon)
              .style({ width: "24px" })
          )
          .appendTo(tableBodyRow);
        console.log(mapping.icon, icons[mapping.icon]);

        new Html("td").text(file.item).appendTo(tableBodyRow);
        new Html("td").text(userFriendlyFileType).appendTo(tableBodyRow);
      }

      if (fileList.length === 0) {
        tableBody.append(
          new Html("tr")
            .attr({ colspan: "2" })
            .appendMany(new Html("label").text("This directory is empty."))
            .styleJs({ padding: "12px", display: "block" })
        );
      }
    }

    await renderFileList(path);
    // wrapper.append(
    //   compatibility.start(
    //     await fetch("/compatibility/pkgs/apps/Terminal.js").then((r) =>
    //       r.text()
    //     )
    //   )
    // );
  },
  end: async function () {
    // Close the window when the process is exited
    win.close();
  },
};

export default pkg;
