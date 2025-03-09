import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import FileDialog from "../../libs/FileDialog.js";
import langManager from "../../libs/l10n/manager.js";
import { css } from "../../libs/templates.js";
import NowPlaying from "../../libs/NowPlaying.js";

let MyWindow;

export default {
    name: langManager.getString("music.name"),
    type: "app",
    privs: 0,
    start: async function (Root) {
      let wrapper; // Lib.html | undefined
  
      console.log("Hello from example package", Root);
  
      MyWindow = new Ws.data.win({
        title: "Video Player",
        pid: Root.PID,
        onclose: () => {
          Root.End();
        },
      });
  
      // initializing wrappers and Vfs
      wrapper = MyWindow.window.querySelector(".win-content");
  
  
      await Vfs.importFS();
  
      wrapper.classList.add("with-sidebar", "row", "o-h", "h-100");
  
  
      // this function opens the file and changes the title to the file name,
      // we load the file into a buffer
      async function openFile(path) {
        let file;
        if (path) file = path;
        else file = await FileDialog.pickFile("Root");
        if (file === false) return;
        let result = updateVideo(await Vfs.readFile(file));
        if (result === false) return;
        MyWindow.window.querySelector(".win-titlebar .title").innerText =
          "Video Player - " + file.split("/").pop();
        MyWindow.focus();
      }
  
      // creates sidebar
      Sidebar.new(wrapper, [
        {
          onclick: async (_) => {
            openFile();
          },
          html: icons.fileVideo,
          title: "Select Video...",
        },
        {
          style: {
            "margin-top": "auto",
          },
          onclick: (_) => {
            alert("Not implemented");
          },
          html: icons.help,
          title: "Help",
        },
      ]);
  
      // creates the wrapper that the image is in
      let vidWrapper = new Html("div")
        .class("ovh", "fg", "fc", "row")
        .appendTo(wrapper);
  
      // creates the actual img element
      let img = new Html("video")
        .appendTo(vidWrapper)
        .style({
          width: "100%",
          height: "100%",
          "object-fit": "contain",
          border: "none",
        })
        .attr({ draggable: "false", controls: 'on' });
  
      // updates the video on the next load
      function updateVideo(content) {
        if (!content.startsWith("data:video/") && !content.startsWith("blob:")) {
          Root.Modal.alert("Error", "This does not look like a video file").then(
            (_) => {
              MyWindow.focus();
            }
          );
          return false;
        }
        img.elm.src = content;
      }
  
      if (Root.Arguments) {
        let m = Root.Arguments.data
        if (typeof m === "object" && m.type && m.type === "loadFile" && m.path) {
            console.log(m.path)
          openFile(m.path);
        }
      }
    },
      end: async function () {
        MyWindow.close();
      },
  };
  