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
import NowPlaying from "../../libs/NowPlaying.js";
let PhotosWindow;

export default {
    name: langManager.getString("photos.name"),
    type: "app",
    privs: 0,
    start: async function (Root) {
      let wrapper;

  
  
      PhotosWindow = new Ws.data.win({
        title: langManager.getString("photos.name"),
        pid: Root.PID,
        width: 445,
        height: 295,
        onclose: () => {
          Root.End();
        },
      });
  
      // initializing wrappers and Vfs
      wrapper = PhotosWindow.window.querySelector(".win-content");
  
  
      await Vfs.importFS();
  
      wrapper.classList.add("with-sidebar", "row", "o-h", "h-100");
  
  
      // this function opens the file and changes the title to the file name,
      // we load the file into a buffer
      async function openFile(path, img) {
        let file;
        if (path) file = path;
        else file = await FileDialog.pickFile("Root");
        if (file === false) return;
        let result = updateImage(await Vfs.readFile(file), img);
        if (result === false) return;
        PhotosWindow.setTitle(
          `${langManager.getString("photos.name")} - ` +
            file.split("/").pop()
        );
        PhotosWindow.focus();
      }
  
      function updateImage(content, img) {
        // console.log(content);
        if (!content.startsWith("data:image/") && !content.startsWith("blob:")) {
          Modal.alert("Error", langManager.getString("photos.imageLoadError")).then(
            (_) => {
              PhotosWindow.focus();
            }
          );
          return false;
        }
        img.elm.src = content;
      }
  
      // creates sidebar
      let sidebarWrapper = new Html("div")
        .styleJs({ display: "flex" })
        .appendTo(wrapper);
  
      let pageWrapper = new Html("div")
        //   .class("ovh", "fg", "fc", "row")
        .style({
          width: "100%",
          height: "100%",
          overflow: "auto",
        })
        .appendTo(wrapper);
  
      let state = "";
  
      function makeSidebar() {
        sidebarWrapper.clear();
  
        let firstItem;
  
        if (state === "view") {
          firstItem = {
            onclick: async (_) => {
              pages.overview();
            },
            html: icons.arrowUp,
            title: langManager.getString("photos.backToOverview"),
          };
        } else {
          firstItem = {
            onclick: async (_) => {
              pages.overview();
            },
            html: icons.refresh,
            title: langManager.getString("photos.refresh"),
          };
        }
  
        Sidebar.new(sidebarWrapper, [
          firstItem,
          {
            style: {
              "margin-top": "auto",
              "margin-left": "auto",
            },
            onclick: (_) => {
              Modal.alert(
                langManager.getString("photos.noPicturesTitle"),
                langManager.getString("photos.noPicturesDescription"),
                wrapper
              );
            },
            html: icons.help,
            title: langManager.getString("photos.help"),
          },
        ]);
      }
      makeSidebar();
  
      let pages = {
        overview: async () => {
          pageWrapper.clear();
  
          state = "overview";
          makeSidebar();
          PhotosWindow.setTitle(
            `${langManager.getString(
              "photos.name"
            )} - ${langManager.getString("photos.pageOverview")}`
          );
  
          let imageGrid = new Html("div")
            .style({
              display: "grid",
              "grid-template-columns": "repeat(auto-fill, minmax(100px, 1fr)",
              transition: "300ms",
            })
            .appendTo(pageWrapper);
  
          let PicturePath = await Vfs.list("Root/Pictures");
  
          function updImg(content, img) {
            if (
              !content.startsWith("data:image/") &&
              !content.startsWith("blob:")
            ) {
              Modal.alert(
                langManager.getString("photos.error"),
                langManager.getString("photos.imageLoadError")
              ).then((_) => {
                PhotosWindow.focus();
              });
              return false;
            }
  
            return content;
          }
  
          if (PicturePath.length === 0) {
            new Html("div")
              .style({
                padding: "1.5rem 1.8rem",
                width: "100%",
                display: "block",
                position: "absolute",
              })
              .text(langManager.getString("photos.noPictures"))
              .appendTo(imageGrid);
            Modal.alert(
              langManager.getString("photos.noPicturesTitle"),
              langManager.getString("photos.noPicturesDescription"),
              wrapper
            );
          }
  
          PicturePath.forEach(async (element) => {
            let path = "Root/Pictures/" + element.item;
            let file = await Vfs.readFile(path);
            const extension = path.split(".").pop();
            let isImage = await FileMappings.getType(extension);
  
            // non-image checks
            if (isImage === false || isImage !== "image") return;
  
            let imageWrapper = new Html("div")
              .style({
                width: "100%",
                "aspect-ratio": "1",
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
                "background-color": "var(--header)",
              })
              .appendTo(imageGrid);
            new Html("img")
              .attr({
                src: updImg(file),
              })
              .style({
                width: "100%",
                transition: "width 0.3s ease-in-out",
                "object-fit": "cover",
                height: "100%",
              })
              .on("click", () => {
                pages.view(path);
              })
              .appendTo(imageWrapper);
          });
        },
  
        view: (path) => {
          pageWrapper.clear();
  
          state = "view";
          makeSidebar();
  
          // creates the wrapper that the image is in
          let imgWrapper = new Html("div")
            .class("ovh", "fg", "fc", "row")
            .style({
              height: "100%",
            })
            .appendTo(pageWrapper);
  
          // creates the actual img element
          let img = new Html("img")
            .appendTo(imgWrapper)
            .style({
              width: "100%",
              height: "100%",
              "object-fit": "contain",
              border: "none",
            })
            .attr({ draggable: "false" });
  
          openFile(path, img);
        },
      };
  
      pages.overview();
      document.addEventListener("pluto.lang-change", (e) => {
        win.setTitle(langManager.getString("photos.name"));
      });
  
      if (Root.Arguments) {
        let m = Root.Arguments.data
        if (typeof m === "object" && m.type && m.type === "loadFile" && m.path) {
          // openFile(m.path);
          pages.view(m.path);
        }
      }
    },
    end() {
        PhotosWindow.close();
    }
  };
  