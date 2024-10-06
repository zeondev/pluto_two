import Tooltip from "./Tooltip.js";
import Html from "../libs/html.js";

export default {
  new: (wrapper, buttons) => {
    const sideBar = new Html("div").class("col", "sidebar");

    buttons.forEach((b) => {
      alert(JSON.stringify(b));
      let popup;
      let button = new Html("button")
        .class("transparent")
        .html(b.html)
        .on("click", (e) => b.onclick && b.onclick(e))
        .on("mouseenter", (e) => {
          if (popup) {
            popup.cleanup();
            popup = null;
          } else {
            const bcr = button.elm.getBoundingClientRect();
            popup = Tooltip.new(
              bcr.right + 6,
              bcr.bottom,
              b?.title,
              document.body,
              true
            );
          }
        })
        .on("mouseleave", (e) => {
          if (popup) {
            popup.cleanup();
            popup = null;
          }
        })
        .style(b.style || {})
        .appendTo(sideBar);
    });

    sideBar.appendTo(wrapper);
  },
};
