import ctxMenu from "../../libs/CtxMenu.js";
import windowSystem from "../../libs/windowSystem.js";
import Html from "../../libs/html.js";
import langManager from "../../libs/l10n/manager.js";

let wrapper; // Lib.html | undefined
let TaskManagerWindow;
let remakeTable;

export default {
  name: "Task Manager",
  type: "app",
  privs: 1,
  start: async function (Root) {
    TaskManagerWindow = new windowSystem.data.win({
      title: langManager.getString("taskManager.name"),
      content: "Loading...",
      width: "468px",
      height: "320px",
      pid: Root.PID,
      onclose: () => {
        Root.End();
      },
    });

    wrapper = TaskManagerWindow.window.querySelector(".win-content");
    wrapper.innerHTML = "";

    wrapper.classList.add("col");

    const wrapperWrapper = new Html("div").class("fg", "ovh").appendTo(wrapper);
    const table = new Html("table").class("w-100").appendTo(wrapperWrapper);
    const buttonRow = new Html("div").class("row").appendTo(wrapper);

    let selectedPid = -1;

    function makeTaskTable() {
      table.clear();
      let tableHead = new Html("thead").appendTo(table);
      let tableHeadRow = new Html("tr").appendTo(tableHead);
      new Html("th")
        .styleJs({ whiteSpace: "nowrap" })
        .text(langManager.getString("taskManager.table_type"))
        .appendTo(tableHeadRow);
      new Html("th")
        .styleJs({ whiteSpace: "nowrap" })
        .text(langManager.getString("taskManager.table_appId"))
        .appendTo(tableHeadRow);
      new Html("th")
        .styleJs({ whiteSpace: "nowrap" })
        .text(langManager.getString("taskManager.table_details"))
        .attr({ colspan: 2 })
        .appendTo(tableHeadRow);
      new Html("th")
        .styleJs({ whiteSpace: "nowrap" })
        .text(langManager.getString("taskManager.table_pid"))
        .appendTo(tableHeadRow);

      let tableBody = new Html("tbody").appendTo(table);

      let processes = Array.from(
        Root.Core !== null ? Root.Core.Processes.list : new Map()
      );

      for (let i = 0; i < processes.length; i++) {
        console.log(
          processes[i],
          processes[i][1]
          // Object.keys(processes[i][1]),
          // Object.keys(processes[i][1]).length,
          // Object.keys(processes[i][1]).length === 0 &&
          //   Object.keys(processes[i][1]).length !== null
        );
        if (processes[i][1] !== null) {
          if (Object.keys(processes[i][1]).length === 0) {
            continue;
          }
        }
        let tableBodyRow = new Html("tr")
          .on("click", (_) => {
            selectedPid = proc[1].pid;
            makeTaskTable();
          })
          .on("contextmenu", (e) => {
            e.preventDefault();
            ctxMenu.data.new(e.clientX, e.clientY, [
              {
                item: langManager.getString("taskManager.endProcess"),
                async select() {
                  let p = Root.Core.Processes.List.filter(
                    (p) => p[1] !== null
                  ).find((p) => p[1].pid === proc[1].pid);
                  p?.end();
                  selectedPid = -1;
                  makeTaskTable();
                },
              },
            ]);
          })
          .appendTo(tableBody);
        let proc = processes[i];
        if (proc[1] === null) continue;

        if (selectedPid === proc[1].pid) tableBodyRow.class("table-selected");

        let fullName = proc[1].url
          .split("/")
          .filter((n) => n)
          .splice(1);
        let name = fullName[1];
        let category = fullName[0];

        new Html("td").text(category).appendTo(tableBodyRow);
        new Html("td")
          .text(name.replace(".js", "").replace(".pml", ""))
          .appendTo(tableBodyRow);
        if (proc[1]) {
          new Html("td").text(proc[1].name).appendTo(tableBodyRow);
          new Html("td").text("").appendTo(tableBodyRow);
        } else {
          new Html("td")
            .text("N/A")
            .attr({ colspan: 2 })
            .appendTo(tableBodyRow);
        }
        new Html("td").text(proc[1].pid).appendTo(tableBodyRow);
      }
    }

    makeTaskTable();

    let x = new Html("input")
      .attr({ placeholder: langManager.getString("taskManager.input_appId") })
      .class("fg")
      .appendTo(buttonRow);
    /* Button */
    new Html("button")
      .text(langManager.getString("taskManager.launchApp"))
      .appendTo(buttonRow)
      .on("click", (e) => {
        Root.Core.Packages.Run(
          "apps:" + x.elm.value.replace(/([^A-Za-z0-9-])/g, "")
        );
      });

    remakeTable = setInterval((_) => {
      makeTaskTable();
    }, 1000);

    if (Root.Core !== null) {
      new Html("button")
        .class("primary")
        .text(langManager.getString("taskManager.endProcess"))
        .appendTo(buttonRow)
        .on("click", (e) => {
          if (selectedPid === -1) {
            return;
          }
          let p = Array.from(Root.Core.Processes.list)
            .filter((p) => p[1] !== null)
            .find((p) => p[1].pid === selectedPid);
          p[1]?.end();
          selectedPid = -1;
          makeTaskTable();
        });
    }

    document.addEventListener("pluto.lang-change", () => {
      TaskManagerWindow.setTitle(langManager.getString("taskManager.name"));
    });
  },

  async end(root) {
    TaskManagerWindow.close();
    clearInterval(remakeTable);
    return true;
  },
};
