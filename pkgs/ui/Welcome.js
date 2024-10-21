import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import compatibility from "/libs/compatibility.js";
import Vfs from "../../libs/vfs.js";
import { css } from "../../libs/templates.js";
import ThemeLib from "../../libs/ThemeLib.js";
import langManager from "../../libs/l10n/manager.js";
import Accounts from "../../libs/Accounts.js";

let wrapper;

const pkg = {
  name: "Welcome",
  type: "app",
  privs: 1,
  style: css`
    .welcome-wrapper {
      display: flex;
      /* flex-direction: row; */
      align-items: center;
      /* justify-content: center; */
      height: 100%;
      background-image: url("/assets/wallpapers/space3.svg");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      color: var(--text);
      /* padding: 0 20px; */
    }

    .welcome-wrapper .page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background-color: color-mix(in srgb, var(--unfocused), transparent 50%);
      border: var(--outline) solid 1px;
      border-radius: 10px;
      backdrop-filter: blur(5px);
      // text-align: center;
      max-width: 100%;
      width: 46.875rem;
      margin: 0 auto;
      height: 41.5rem;
      /* make it slide in */
      animation: slideInFromBottom var(--animation-duration)
        var(--easing-function) forwards;
    }

    .welcome-wrapper .page-wrapper.p1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap: 1rem;
      /* height: 100%; */
    }

    .welcome-wrapper .page-wrapper.p2 {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      gap: 1rem;
    }

    .welcome-wrapper .page-wrapper.finish {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap: 1rem;
      /* height: 100%; */
    }

    .welcome-wrapper .page-wrapper .p1p1 {
      font-size: 1rem;
      font-weight: 400;
      width: 70%;
      margin: 0;
    }

    .welcome-wrapper .page-wrapper .p1i1 {
      border-radius: 50%;
      width: 150px;
    }

    .welcome-wrapper .page .title {
      /* margin: 1.5rem; */
      position: absolute;
      top: 0;
      border-radius: 10px 10px 0px 0px;
      background-color: transparent;
      left: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: left;
      /* padding-left: 1rem; */
    }

    .welcome-wrapper .page .title h2 {
      /* margin: 0; */
      /* margin-left: 1rem; */
      font-size: 1.5rem;
      font-weight: 650;
      color: var(--text-light);
      padding-left: 1rem;
    }

    .welcome-wrapper .page .button-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row-reverse;

      /* margin: 1.5rem; */
      border-radius: 0px 0px 10px 10px;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 5.5em;
      background-color: transparent;
      padding: 20px;
    }
    .welcome-wrapper .page .button-bar button {
      padding: 8px 48px;
      border: 2px solid rgba(255, 255, 255, 0.4);
    }
    .theme-grid {
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .theme-card {
      height: 12rem;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      overflow: hidden;
    }
    .theme-card .description {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: color-mix(in srgb, var(--unfocused), transparent 50%);
      border-radius: 0px 0px 10px 10px;
      padding: 0.5rem;
      color: var(--text);
    }

    .login-card {
      height: 12rem;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      overflow: hidden;
    }

    .login-card img {
      position: absolute;
      top: 2.5rem;
      width: 120px;
      height: 120px;
    }

    .login-card .description {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: color-mix(in srgb, var(--unfocused), transparent 50%);
      border-radius: 0px 0px 10px 10px;
      padding: 0.5rem;
      color: var(--text);
      backdrop-filter: blur(5px);
      --webkit-backdrop-filter: blur(5px);
    }
  `,
  start: async function (Root) {
    // alert(JSON.stringify(await Accounts.getUserData()));

    wrapper = new Html("div").class("welcome-wrapper").appendTo(document.body);
    let page = new Html("div").class("page").appendTo(wrapper);
    let pageWrapper = new Html("div").class("page-wrapper").appendTo(page);
    let title = new Html("div").class("title").appendTo(page);
    let buttonBar = new Html("div")
      .class("button-bar")
      // .appendMany(
      //   new Html("button")
      //     .text("Next")
      //     .on("click", () => {})
      //     .class("button"),

      //   new Html("button")
      //     .text("Back")
      //     .on("click", () => {})
      //     .class("button")
      // )
      .appendTo(page);

    let decorativeWindow = await fetch("./assets/decorative-window.svg").then(
      (svg) => svg.text()
    );

    let currentPage = "p1";

    let pages = {
      p1: () => {
        currentPage = "p1";
        pageWrapper.clear();
        buttonBar.clear();
        pageWrapper.classOff("p2");
        pageWrapper.classOff("finish");

        pageWrapper.classOn("p1");

        new Html("img")
          .class("p1i1")
          .attr({ src: "/assets/pluto_logo_new.svg" })
          .appendTo(pageWrapper);
        // new Html("h1").text("Pluto").appendTo(pageWrapper);
        new Html("h1")
          .class("b")
          .style({ margin: "0" })
          .text(langManager.getString("welcome.p1.welcome"))
          .appendTo(pageWrapper);
        new Html("p")
          .class("h1")
          .text(langManager.getString("welcome.p1.welcomeMessage"))
          .style({
            "font-weight": "400",
          })
          .appendTo(pageWrapper);
        new Html("button")
          .class("primary")
          .text(langManager.getString("actions.next"))
          .style({
            padding: "8px 48px",
            border: "2px solid color-mix(in srgb, var(--primary), #fff 40%)",
          })
          .on("click", pages.p2)
          .appendTo(pageWrapper);
      },
      p2: () => {
        currentPage = "p2";
        pageWrapper.classOff("p1");
        pageWrapper.classOff("finish");

        pageWrapper.classOn("p2");

        pageWrapper.clear();

        new Html("h1")
          .text(langManager.getString("welcome.p2.chooseLang"))
          .style({ margin: "20px 0px 0px 20px" })
          .appendTo(pageWrapper);
        new Html("span")
          .class("h2")
          .text(langManager.getString("welcome.p2.chooseLangMessage"))
          .style({ margin: "0px 0px 0px 20px" })
          .appendTo(pageWrapper);

        let langs = langManager.langs;
        new Html("div")
          .class("lang-list")
          .appendMany(
            ...langs.map((l) => {
              return new Html("button")
                .text(langManager.getString("languages." + l))
                .on("click", () => {
                  langManager.setLanguage(l);
                });
            })
          )
          .appendTo(pageWrapper);

        buttonBar.clear();
        buttonBar.appendMany(
          new Html("button")
            .text(langManager.getString("actions.next"))
            .class("primary")
            .on("click", pages.p3),
          new Html("button")
            .text(langManager.getString("actions.back"))
            .on("click", pages.p1)
        );
      },
      p3: () => {
        currentPage = "p3";
        pageWrapper.classOff("p1");
        pageWrapper.classOn("p2");

        pageWrapper.clear();

        new Html("h1")
          .text(langManager.getString("welcome.p3.chooseTheme"))
          .style({ margin: "20px 0px 0px 20px" })
          .appendTo(pageWrapper);
        new Html("span")
          .class("h2")
          .text(langManager.getString("welcome.p3.chooseThemeMessage"))
          .style({ margin: "0px 0px 0px 20px" })

          .appendTo(pageWrapper);

        new Html("div")
          .class("theme-grid")
          .appendTo(pageWrapper)
          .appendMany(
            new Html("div")
              .attr({ "data-theme": "dark" })
              .class("theme-card")
              .styleJs({
                backgroundImage: "url('/assets/wallpapers/space3.png')",
              })
              .html(decorativeWindow)
              .appendMany(
                new Html("div")
                  .text(langManager.getString("welcome.p3.themeDark"))
                  .class("description")
              )
              .on("click", async () => {
                ThemeLib.setCurrentTheme(
                  JSON.parse(
                    await Vfs.readFile("Root/Pluto/config/themes/dark.theme")
                  )
                );
              }),
            new Html("div")
              .class("theme-card")
              .attr({ "data-theme": "light" })
              .styleJs({
                backgroundImage: "url('/assets/wallpapers/light2.png')",
              })
              .html(decorativeWindow)
              .appendMany(
                new Html("div")
                  .text(langManager.getString("welcome.p3.themeLight"))
                  .class("description")
              )
              .on("click", async () => {
                ThemeLib.setCurrentTheme(
                  JSON.parse(
                    await Vfs.readFile("Root/Pluto/config/themes/light.theme")
                  )
                );
              }),
            new Html("div")
              .class("theme-card")
              .attr({ "data-theme": "green" })
              .styleJs({
                backgroundImage: "url('/assets/wallpapers/green.jpg')",
              })
              .html(decorativeWindow)
              .appendMany(
                new Html("div")
                  .text(langManager.getString("welcome.p3.themeGreen"))
                  .class("description")
              )
              .on("click", async () => {
                ThemeLib.setCurrentTheme(
                  JSON.parse(
                    await Vfs.readFile("Root/Pluto/config/themes/green.theme")
                  )
                );
              }),
            new Html("div")
              .class("theme-card")
              .attr({ "data-theme": "red" })
              .styleJs({
                backgroundImage: "url('/assets/wallpapers/red.png')",
              })
              .html(decorativeWindow)
              .appendMany(
                new Html("div")
                  .text(langManager.getString("welcome.p3.themeRed"))
                  .class("description")
              )
              .on("click", async () => {
                ThemeLib.setCurrentTheme(
                  JSON.parse(
                    await Vfs.readFile("Root/Pluto/config/themes/red.theme")
                  )
                );
              })
          )
          .appendTo(pageWrapper);

        buttonBar.clear();
        buttonBar.appendMany(
          new Html("button")
            .text(langManager.getString("actions.next"))
            .class("primary")
            .on("click", pages.p4),
          new Html("button")
            .text(langManager.getString("actions.back"))
            .on("click", pages.p2)
        );
      },
      p4: () => {
        currentPage = "p4";
        pageWrapper.classOff("p1");
        pageWrapper.classOn("p2");

        pageWrapper.clear();

        new Html("h1")
          .text(langManager.getString("welcome.p4.accounts"))
          .style({ margin: "20px 0px 0px 20px" })
          .appendTo(pageWrapper);
        new Html("span")
          .class("h2")
          .text(langManager.getString("welcome.p4.accountsMessage"))
          .style({ margin: "0px 0px 0px 20px" })

          .appendTo(pageWrapper);

        new Html("div")
          .style({
            display: "flex",
            gap: "3rem",
            "flex-direction": "row",
            height: "28rem",
            "align-items": "center",
            "justify-content": "center",
          })
          .appendMany(
            new Html("button")
              .class("login-card")

              .style({
                height: "236px",
                width: "200px",
                outline: "1.5px solid rgba(255, 255, 255, 0.2)",
              })
              .appendMany(
                new Html("img").attr({ src: "./assets/zeon-tinted.svg" }),

                new Html("div")
                  .text("Zeon " + langManager.getString("welcome.p4.account"))
                  .class("description")
              )

              .on("click", pages.p5),
            new Html("button")
              // .text("Register")
              .class("login-card")
              .style({
                height: "236px",
                width: "200px",
                outline: "1.5px solid rgba(255, 255, 255, 0.2)",
              })
              .appendMany(
                new Html("img").attr({ src: "./assets/user-profile.svg" }),
                new Html("div")
                  .text(langManager.getString("actions.skip"))
                  .class("description")
              )

              .on("click", pages.finish)
          )
          .appendTo(pageWrapper);

        buttonBar.clear();
        buttonBar.appendMany(
          // new Html("button")
          //   .text("Next")
          //   .class("primary")
          //   .on("click", pages.p5),#
          new Html("div"),
          new Html("button")
            .text(langManager.getString("actions.back"))
            .on("click", pages.p3)
        );
      },
      p5: () => {
        currentPage = "p5";
        pageWrapper.classOff("p1");
        pageWrapper.classOn("p2");
        pageWrapper.classOff("finish");

        pageWrapper.clear();

        new Html("h1")
          .text(langManager.getString("welcome.p5.login"))
          .style({ margin: "20px 0px 0px 20px" })
          .appendTo(pageWrapper);
        new Html("span")
          .class("h2")
          .text(langManager.getString("welcome.p5.loginMessage"))
          .style({ margin: "0px 0px 0px 20px" })

          .appendTo(pageWrapper);

        let username = new Html("input")
          .style({
            padding: "0.5rem",
          })
          .attr({
            type: "text",
            placeholder: langManager.getString("welcome.p5.username"),
          });

        let password = new Html("input")
          .style({
            padding: "0.5rem",
          })
          .attr({
            type: "password",
            placeholder: langManager.getString("welcome.p5.password"),
          });

        let danger = new Html("span")
          .class("danger")
          .style({ "margin-top": "10px" });

        new Html("div")
          .style({
            display: "flex",
            gap: "1rem",
            "flex-direction": "column",
            height: "28rem",
            "align-items": "center",
            "margin-top": "1rem",
          })
          .appendMany(
            new Html("div")
              .appendMany(
                new Html("span").text(
                  langManager.getString("welcome.p5.enterUsername")
                ),
                username
              )
              .style({
                display: "flex",
                "flex-direction": "column",
                gap: "0.25rem",

                width: "92.5%",
              }),
            new Html("div")
              .appendMany(
                new Html("span").text(
                  langManager.getString("welcome.p5.enterPassword")
                ),

                password,
                danger
              )
              .style({
                display: "flex",
                "flex-direction": "column",
                gap: "0.25rem",
                width: "92.5%",
              })
          )
          .appendTo(pageWrapper);

        buttonBar.clear();
        buttonBar.appendMany(
          new Html("button")
            .text(langManager.getString("actions.finish"))
            .class("primary")
            .on("click", () => {
              if (username.elm.value === "" || password.elm.value === "") {
                danger.text("Please enter a username and password.");
                return;
              }

              Accounts.login(username.elm.value, password.elm.value).then(
                (data) => {
                  console.log(data.status);
                  if (data.status !== 200) {
                    console.error("Error logging in", data);
                    if (data.status === 404 || data.status === 409) {
                      danger.text("Invalid username or password.");
                    }
                    if (data.status === 500) {
                      danger.text("Internal server error.");
                    }

                    return;
                  }
                  pages.finish();
                }
              );
            }),
          new Html("button")
            .text(langManager.getString("actions.back"))
            .on("click", pages.p4)
        );
      },
      finish: () => {
        currentPage = "finish";
        pageWrapper.clear();
        buttonBar.clear();
        pageWrapper.classOff("p1");
        pageWrapper.classOff("p2");
        pageWrapper.classOn("finish");
        new Html("img")
          .class("p1i1")
          .attr({ src: "/assets/tick.svg" })
          .appendTo(pageWrapper);
        // new Html("h1").text("Pluto").appendTo(pageWrapper);
        new Html("h1")
          .class("b")
          .style({ margin: "0" })
          .text(langManager.getString("welcome.finish.thanks"))
          .appendTo(pageWrapper);
        new Html("p")
          .class("h1")
          .text(langManager.getString("welcome.finish.thanksMessage"))
          .style({
            "font-weight": "400",
          })
          .appendTo(pageWrapper);
        new Html("button")
          .class("primary")
          .text(langManager.getString("actions.close"))
          .style({
            padding: "8px 48px",
            border: "2px solid color-mix(in srgb, var(--primary), #fff 40%)",
          })
          .on("click", finishOOBE)
          .appendTo(pageWrapper);
      },
    };
    pages.p1();

    document.addEventListener("pluto.lang-change", () => {
      // language is updated , please Refresh
      pages[currentPage]();
    });

    document.addEventListener("pluto.wallpaper-change", (e) => {
      console.log("got wallpaper change event", e);
      wrapper.style({ "background-image": `url(${e.detail})` });
    });

    async function finishOOBE() {
      await Root.End();
      await Root.Core.Packages.Run("ui:Desktop", true, true);
    }
  },
  end: async function () {
    // Close the window when the process is exited
    // myWindow.close();
    wrapper.cleanup();
    return true;
  },
};

export default pkg;
