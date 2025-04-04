import CtxMenu from "../libs/CtxMenu.js";
import Html from "../libs/html.js";

function escapeHtml(str) {
  if (str !== undefined)
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}

export default {
  name: "DropDown",
  description: "Create vertical select lists used in GUI apps.",
  ver: "v1.6.2", // Supports minimum Core version of v1.6.2
  type: "component",
  new: (wrapper, items, onSelect, selectedItem, maxWidth = "180px") => {
    const textSpan = new Html("span").text("Select...");

    const dropDown = new Html("button")
      .attr({ "tab-index": "0" })
      .class("row", "gap")
      .styleJs({ alignItems: "flex-end", maxWidth })
      .appendMany(
        textSpan,
        new Html("span")
          .style({ width: "17px", height: "17px" })
          .html(
            `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down" style="width: 17px; height: 17px; align-self: flex-end;"><path d="m6 9 6 6 6-6"></path></svg>`
          )
      );
    let popup = null;
    let selectedId = selectedItem;

    if (window.__DEBUG) console.log(items, selectedId);

    const sItem = items.find((i) => i.id === selectedId);

    if (sItem !== undefined) {
      textSpan.text(sItem.item);
    } else {
      textSpan.text("Select...");
    }

    dropDown.on("mousedown", () => {
      if (popup) {
        popup.cleanup();
        popup = null;
      }
    });
    dropDown.on("click", () => {
      if (popup) {
        popup.cleanup();
        popup = null;
      } else {
        const bcr = dropDown.elm.getBoundingClientRect();
        popup = CtxMenu.new(
          bcr.left,
          bcr.bottom,
          items.map((item) => {
            if (typeof item.id === undefined)
              return console.error("Bad select ID.");
            let text = `<span>${escapeHtml(item.item)}</span>`;
            if (item.id === selectedId) {
              text = `<span>${escapeHtml(
                item.item
              )}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check ml-auto" style="width: 1.25em; height: 1.25em;"><path d="M20 6 9 17l-5-5"></path></svg>`;
            }
            if (item.type !== undefined) {
              if (item.type === "separator") {
                return {
                  item: "<hr>",
                  selectable: false,
                };
              } else return item;
            }

            return {
              item: text,
              select: () => {
                selectedId = item.id;
                textSpan.text(item.item);
                onSelect(item.id);
              },
            };
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
    });

    if (wrapper !== undefined) dropDown.appendTo(wrapper);

    return dropDown;
  },
};
