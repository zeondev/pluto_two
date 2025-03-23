import Html from "../../libs/html.js";
import windowSystem from "../../libs/windowSystem.js";
import PanicParser from "../../libs/PanicParser.js";
let wrapper; // Lib.html | undefined
let MyWindow;
export default {
    name: "Panic Viewer",
    type: "app",
    privs: 1,
    start: async function (Root) {

  
      console.log("Hello from example package", Root.Lib);
  
  
      MyWindow = new windowSystem.data.win({
        title: "Panic Viewer",
        content: "",
        pid: Root.PID,
        width: 480,
        height: 480,
        onclose: () => {
          Root.End();
        },
      });
  
  
      console.log("Hio?")
      wrapper = MyWindow.window.querySelector(".win-content");
  
  
      async function performSecurityScan() {
        let dc = await PanicParser.scanPanicFolder();

        console.log(dc)
        table.clear();
  
        new Html("thead")
          .appendMany(
            new Html("tr").appendMany(
              new Html("th").text("Reason"),
              new Html("th").text("Stack"),
              new Html("th").text("Time")
            )
          )
          .appendTo(table);
  
        console.log(dc, dc.length, 0 < dc.length, 1 < dc.length);
  
        try {
          let newDc = dc.sort((a, b) => {
            let dateA = new Date(JSON.parse(a.content).date);
            let dateB = new Date(JSON.parse(b.content).date);
            return dateB - dateA; // For descending order. Use dateA - dateB for ascending order.
          });
        } catch (e) {
          console.log(e);
        }
  
        for (let i = 0; i < dc.length; i++) {
          try {
            if (dc[i].success) {
              console.log(dc[i].content);
              let dcContent = JSON.parse(dc[i].content);
              new Html("tbody")
                .appendMany(
                  new Html("tr").appendMany(
                    new Html("td").text(dcContent.reason),
                    new Html("td").text(dcContent.stack),
                    new Html("td").text(dcContent.date)
                    //         why ^^^^^^^^^^ ??? what
                  )
                )
                .appendTo(table);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
  
      let table = new Html("table").appendTo(wrapper);
      performSecurityScan();
  
    },
    async end(Root) {
        MyWindow.close()
        return true;
    }
  };
  