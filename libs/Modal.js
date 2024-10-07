import Html from "./html.js";

export default {
  modal: function (
    title,
    content,
    parent = "body",
    contentIsHtml = false,
    ...buttons
  ) {
    if (content === undefined && title) {
      content = "" + title;
      title = "Alert";
    }

    let modalContent = new Html("div").class("modal-content");
    let modalHeader = new Html("div").class("modal-header");
    let modalBody = new Html("div").class("modal-body");
    modalContent.appendMany(modalHeader, modalBody);

    const x = new Html("div").class("modal").append(modalContent);

    new Html("span").text(title).appendTo(modalHeader);
    if (contentIsHtml === false) {
      new Html("span").html(content).appendTo(modalBody);
    } else {
      content.appendTo(modalBody);
    }
    new Html("div").class("flex-group").appendTo(modalBody);

    for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      if (!button.text || !button.callback)
        throw new Error("Invalid button configuration");

      const b = new Html("button").text(button.text).on("click", (e) => {
        x.class("closing");
        setTimeout(() => {
          x.cleanup();
          button.callback(e);
        }, 350);
      });

      if (button.type && button.type === "primary") b.class("primary");
      if (button.type && button.type === "danger") b.class("danger");

      b.appendTo(modalContent.elm.querySelector(".flex-group"));
    }

    x.appendTo(parent);

    // use RAF to assure all elements are painted
    requestAnimationFrame(() => {
      const focusableElements = x.elm.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="checkbox"], input[type="radio"], select'
      );
      this.elementsArray = Array.prototype.slice.call(focusableElements);
      this.elementsArray.forEach((el) => {
        el.setAttribute("tabindex", "0");
      });

      this.elementsArray[0].addEventListener("keydown", (e) => {
        if (e.key === "Tab" && e.shiftKey) {
          e.preventDefault();
          this.elementsArray[this.elementsArray.length - 1].focus();
        }
      });
      this.elementsArray[this.elementsArray.length - 1].addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            this.elementsArray[0].focus();
          }
        }
      );
      this.elementsArray[0].focus();
    });

    requestAnimationFrame(() => {
      modalBody.elm.querySelector("input,button").focus();
    });

    return x;
  },
  alert: function (title, content, parent = "body") {
    return new Promise((res, _rej) => {
      this.modal(title, content, parent, false, {
        text: "Alert",
        callback: (_) => res(true),
      });
    });
  },
  prompt: function (title, content, parent = "body", dangerous = false) {
    return new Promise((res, _rej) => {
      this.modal(
        title,
        content,
        parent,
        false,
        {
          text: "Yes",
          type: dangerous ? "danger" : "primary",
          callback: (_) => res(true),
        },
        {
          text: "No",
          callback: (_) => res(false),
        }
      );
    });
  },
  input: function (
    title,
    description,
    placeholder,
    parent = "body",
    isPassword = false,
    value = ""
  ) {
    return new Promise((res, _rej) => {
      let wrapper = new Html("div").class("col");
      let modal = this.modal(
        title,
        wrapper,
        parent,
        true,
        {
          text: "Ok",
          type: "primary",
          callback: (_) => {
            res(input.elm.value);
          },
        },
        {
          text: "Cancel",
          callback: (_) => res(false),
        }
      );

      /* span */ new Html("span").text(description).appendTo(wrapper);
      let input = new Html("input")
        .attr({
          placeholder,
          value,
          type: isPassword === true ? "password" : "text",
        })
        .on("keyup", (e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            // submit modal
            modal.class("closing");
            setTimeout(() => {
              modal.cleanup();
              res(input.elm.value);
            }, 350);
          }
        })
        .appendTo(wrapper);
    });
  },
};
