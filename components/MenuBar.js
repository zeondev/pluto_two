
import Html from "../libs/html.js";
import CtxMenu from "../libs/CtxMenu.js";


function escapeHtml(str) {
    if (str !== undefined)
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
  }

export default {
    new: (wrapper, buttons) => {
      const sideBar = new Html("div").class("row", "menu-bar");

      let popup;
      buttons.forEach((b) => {
        let button = new Html("button")
          .class("transparent")
          .text(b.item)
          .on("mousedown", () => {
            popup.cleanup();
            popup = null;
          })
          .on("click", (e) => {
            if (popup) {
              popup.cleanup();
              popup = null;
            } else {
              const bcr = button.elm.getBoundingClientRect();
              popup = CtxMenu
                .new(
                  bcr.left,
                  bcr.bottom,
                  b.items.map((item) => {
                    let text = `<span>${escapeHtml(item.item)}</span>`;
                    if (item.icon) {
                      text = `${item.icon}<span>${escapeHtml(
                        item.item
                      )}</span>`;
                    }
                    if (item.type !== undefined) {
                      if (item.type === "separator") {
                        return {
                          item: "<hr>",
                          selectable: false,
                        };
                      } else return item;
                    }
                    if (item.key !== undefined) {
                      return {
                        item:
                          text +
                          `<span class="ml-auto label">${item.key}</span>`,
                        select: item.select,
                      };
                    } else {
                      return { item: text, select: item.select };
                    }
                  }),
                  null,
                  document.body,
                  true,
                  true
                )
                .styleJs({
                  minWidth: "150px",
                })
                .appendTo("body");
            }
          })
          .style(b.style || {})
          .appendTo(sideBar);
      });

      sideBar.appendTo(wrapper);

      return sideBar;
    },
};