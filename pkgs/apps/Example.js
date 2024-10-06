import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/icons.js";

let myWindow;

const pkg = {
  name: "Welcome",
  type: "app",
  privs: 0,
  start: async function (Root) {
    console.log(Ws.data);
    myWindow = new Ws.data.win({
      title: "Compatibility",
      icon: "/assets/pluto-logo.svg",
      width: 400,
      height: 400,
    });

    let wrapper = myWindow.window.querySelector(".win-content");
    wrapper.classList.add("with-sidebar", "o-h");

    let sidebar = Sidebar.new(wrapper, [
      {
        onclick: async (_) => {
          if (path === "Root") return;

          let p = await vfs.getParentFolder(path);
          path = p;
          renderFileList(p);
        },
        html: icons.arrowUp,
        title: "Up a directory",
      },
      {
        onclick: async (_) => {
          let result = await Root.Modal.input(
            "Input",
            "New folder name",
            "New folder"
          );
          if (result === false) return;
          result = result.replace(/\//g, "");
          await vfs.createFolder(path + "/" + result);
          renderFileList(path);
        },
        html: icons.createFolder,
        title: "Create Folder",
      },
      {
        onclick: async (_) => {
          let result = await Root.Modal.input(
            "Input",
            "New file name",
            "New file"
          );
          if (result === false) return;
          result = result.replace(/\//g, "");
          await vfs.writeFile(path + "/" + result, "");
          renderFileList(path);
        },
        html: icons.createFile,
        title: "Create File",
      },
      {
        onclick: async (_) => {
          let result = await Root.Modal.input(
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
          let i = await vfs.whatIs(selectedItem);
          if (i === "dir")
            return Root.Modal.alert(
              "Error",
              "Folder download is not yet supported.",
              wrapper
            );
          let text = await vfs.readFile(selectedItem, undefined);

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
          var input = new Root.Lib.html("input").elm;
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

                await vfs.writeFile(
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

                await vfs.writeFile(
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
          let i = await vfs.whatIs(selectedItem);
          let result = await Root.Modal.prompt(
            "Notice",
            `Are you sure you want to delete this ${
              i === "dir" ? "folder" : "file"
            }?`
          );
          if (result === true) {
            await vfs.delete(selectedItem);
            renderFileList(path);
          }
        },
        html: icons.delete,
        title: "Delete File",
      },
    ]);
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
    myWindow.close();
  },
};

export default pkg;
