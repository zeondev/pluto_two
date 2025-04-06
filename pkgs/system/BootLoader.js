import Html from "/libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import ThemeLib from "../../libs/ThemeLib.js";
import langManager from "../../libs/l10n/manager.js";
import Users from "../../libs/Users.js";
import FileMappings from "../../libs/FileMappings.js";
import lgs from "../ui/LoginScreen.js";

let myWindow;

const pkg = {
  name: "BootLoader",
  type: "app",
  privs: 1,
  start: async function (Root) {
    try {
      if (localStorage.getItem("error") == "force")
        throw TypeError("Forced error");
      if (localStorage.getItem("recovery") == "true") {
        localStorage.removeItem("recovery");
        throw Error("Restart into recovery");
      }
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
        await Vfs.readFile(
          "Root/Pluto/config/themes/" + appearanceConfig.theme
        ),
        Vfs
      );
      async function checkTheme() {
        if (
          appearanceConfig.theme &&
          appearanceConfig.theme.endsWith(".theme")
        ) {
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
            '{"version":1,"name":"Dark","description":"A built-in theme.","values":null,"cssThemeDataset":"dark","wallpaper":"./assets/wallpapers/space3.png"}'
          );
        }
      }

      // await Root.Core.Packages.Run("ui:Desktop");
      // await Root.Core.Packages.Run("apps:Notepad");
      // ply startup stound
      let a = new Audio("./assets/startup.wav");
      a.volume = 0.5;
      a.play();

      window.Vfs = Vfs;
      await checkTheme();

      if (await Vfs.exists("Root/Pluto/config/settingsConfig.json")) {
        let settingsConfig = JSON.parse(
          await Vfs.readFile("Root/Pluto/config/settingsConfig.json")
        );

        if (settingsConfig !== undefined && settingsConfig.NoUI !== undefined) {
          if (settingsConfig.NoUI === true) {
            await Root.Core.Packages.Run("system:NoUI", true, true);
          } else {
            if (
              settingsConfig !== undefined &&
              settingsConfig.bootApp !== undefined
            ) {
              let appMapping = await FileMapping.retrieveAllMIMEdata(
                settingsConfig.bootApp,
                vfs
              );
              appMapping.onClick(Root.Core);
              // await Root.Core.startPkg(
              //   mapping.onClick(Root.Core);
              //   await vfs.readFile(settingsConfig.bootApp),
              //   false,
              //   true
              // );
            } else {
              if (appearanceConfig.hasSetupSystem !== true) {
                await Root.Core.Packages.Run("ui:Welcome", true, true);
              } else {
                await lgs.launch();

                await Root.Core.Packages.Run("ui:Desktop", true, true);
              }
            }
          }
        } else {
          if (appearanceConfig.hasSetupSystem !== true) {
            await Root.Core.Packages.Run("ui:Welcome", true, true);
          } else {
            await lgs.launch();

            await Root.Core.Packages.Run("ui:Desktop", true, true);
          }
        }
      } else {
        if (appearanceConfig.hasSetupSystem !== true) {
          await Root.Core.Packages.Run("ui:Welcome", true, true);
        } else {
          await lgs.launch();
          await Root.Core.Packages.Run("ui:Desktop", true, true);
        }
      }

      // await ThemeLib.setCurrentTheme(
      //   await Vfs.readFile("Root/Pluto/config/themes/light.theme")
      // );

      // await Root.Core.Packages.Run("apps:FileManager", true, true);
      // await Root.Core.Packages.Run("apps:Compatibility");
    } catch (e) {
      Root.Core.Packages.Run("system:Basic", true, true);
      window.err = e;
    }
  },
  end: async function () {
    // Close the window when the process is exited
    return false;
  },
};

export default pkg;
