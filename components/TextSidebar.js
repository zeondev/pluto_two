import Html from "../libs/html.js";

export default {
  new: (wrapper, buttons) => {
    const sideBar = new Html("div").class("col", "text-sidebar");

    buttons.forEach((b) =>
      new Html("button")
        .class("sidebar-item", "m-0", "transparent", "small")
        .appendMany(
          new Html("div").class("sidebar-icon").html(b.icon),
          new Html("div").class("sidebar-text").html(b.text)
        )
        .on("click", (e) => {
          b.onclick && b.onclick(e);
        })
        .style(b.style || {})
        .appendTo(sideBar)
    );

    sideBar.appendTo(wrapper);
  },
};
