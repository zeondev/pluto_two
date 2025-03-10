import Html from "/libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import ThemeLib from "../../libs/ThemeLib.js";
import langManager from "../../libs/l10n/manager.js";
import Users from "../../libs/Users.js";

let myWindow;

const pkg = {
  name: "BootLoader",
  type: "app",
  privs: 1,
  start: async function (Root) {
    await Vfs.importFS();
    console.log(Root);
    console.log("BootLoader started");

    console.log(Vfs);
    let appearanceConfigRaw = await Vfs.readFile(
      "Root/Pluto/config/appearanceConfig.json"
    );
    let appearanceConfig = JSON.parse(appearanceConfigRaw);

    console.log(appearanceConfig, appearanceConfigRaw);
    console.log(
      await Vfs.readFile("Root/Pluto/config/themes/" + appearanceConfig.theme),
      Vfs
    );
    async function checkTheme() {
      if (appearanceConfig.theme && appearanceConfig.theme.endsWith(".theme")) {
        const x = ThemeLib.validateTheme(
          await Vfs.readFile(
            "Root/Pluto/config/themes/" + appearanceConfig.theme
          )
        );

        console.log(x);

        if (x !== undefined && x.success === true) {
          console.log(x);
          console.error(x);
          ThemeLib.setCurrentTheme(x.data);
        } else {
          console.log("MESSAGE HERE", x.message);
          document.documentElement.dataset.theme = "dark";
        }
      } else {
        console.error("FARDED");
        ThemeLib.setCurrentTheme(
          '{"version":1,"name":"Dark","description":"A built-in theme.","values":null,"cssThemeDataset":"dark","wallpaper":"./assets/wallpapers/space.png"}'
        );
      }
    }

    // await Root.Core.Packages.Run("ui:Desktop");
    // await Root.Core.Packages.Run("apps:Notepad");
    if (appearanceConfig.hasSetupSystem !== true) {
      await Root.Core.Packages.Run("ui:Welcome", true, true);
    } else {
      await Root.Core.Packages.Run("ui:Desktop", true, true);
    }
    // await ThemeLib.setCurrentTheme(
    //   await Vfs.readFile("Root/Pluto/config/themes/light.theme")
    // );

    // await Root.Core.Packages.Run("apps:FileManager", true, true);
    // await Root.Core.Packages.Run("apps:Compatibility");

    // ply startup stound
    let a = new Audio("./assets/startup.wav");
    a.volume = 0.5;
    a.play();

    window.Vfs = Vfs;
    await checkTheme();
  },
  end: async function () {
    // Close the window when the process is exited
    return false;
  },
};

export default pkg;
