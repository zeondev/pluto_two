//
// Pluto Hydra Core
// Made with ❤️
// (c) 2024 Zeon.dev et al.
// Licensed under the GNU Public License v3.0
//

"use strict";

import compatibility from "./libs/compatibility.js";
import Html from "./libs/html.js";
import windowSystem from "./libs/windowSystem.js";

function getCoreStyles() {
  if (Html.qs("#core-styles")) return Html.qs("#core-styles");
  else return new Html("style").attr({ id: "core-styles" }).appendTo("head");
}

let Security = {
  check: (pkgData) => {
    return confirm(
      "This package " +
        pkgData.name +
        " requires elevated privileges. Do you want to continue?"
    );
  },
};

let RegisteredApps = new Map();

let Processes = {
  list: new Map(),
  add: (pid, process) => {
    Processes.list.set(pid, process);
  },
  get: (pid) => {
    return Processes.list.get(pid);
  },
  remove: (pid) => {
    if (Processes.list.has(pid)) {
      Processes.list.set(pid, null);
      Processes.list.delete(pid);
    }
    return;
  },
  findEmptyPid: () => {
    let emptyPid = null;
    Processes.list.forEach((value, key) => {
      if (value === null) {
        emptyPid = key;
      }
    });
    return emptyPid !== null ? emptyPid : Processes.list.size;
  },
};

let Packages = {
  startFromURL: async (url, args = [], denySecurity = false) => {
    const pkg = await import(url);
    const pkgData = pkg.default;
    let privilegedApp = false;

    RegisteredApps.set(pkgData.name, {
      name: pkgData.name,
      url,
      privs: pkgData.privs,
    });

    if (!pkgData || typeof pkgData !== "object") return false;
    if (!pkgData.start || typeof pkgData.start !== "function") return false;
    if (!pkgData.end || typeof pkgData.end !== "function") return false;
    if (!pkgData.name || typeof pkgData.name !== "string") return false;
    // if (!pkgData.type || typeof pkgData.type !== "string") return false;
    if (pkgData.svcName !== undefined && typeof pkgData.svcName !== "string")
      return false;
    if (pkgData.data !== undefined && typeof pkgData.data !== "object")
      return false;
    if (pkgData.privs === undefined || typeof pkgData.privs !== "number")
      return false;
    if (pkgData.style !== undefined && typeof pkgData.style !== "string")
      return false;
    if (pkgData.icon !== undefined && typeof pkgData.icon !== "string")
      return false;
    if (!denySecurity) {
      if (pkgData.privs === 1) {
        let securityAccept = Security.check(pkgData);
        if (securityAccept) {
          privilegedApp = true;
        }
      } else {
        privilegedApp = pkgData.privs === 1 ? true : false;
      }
    } else {
      privilegedApp = pkgData.privs === 1 ? true : false;
    }

    console.log(privilegedApp);

    const pid = Processes.findEmptyPid();
    Processes.add(pid, {
      pid,
      icon: pkgData.icon,
      name: pkgData.name,
      priveleged: pkgData.privs,
      async end() {
        let result = await pkgData.end();
        if (result == true) Processes.remove(pid);
      },
    });
    console.log(privilegedApp);
    const PackageLib = {
      PID: pid,
      Arguments: args,
      Core: privilegedApp == true ? Core : null,
      Packages: privilegedApp == true ? Packages : null,
      RegisteredApps: privilegedApp == true ? RegisteredApps : null,
      Details,
      async End() {
        let result = await pkgData.end();
        if (result == true) Processes.remove(pid);
      },
      Processes:
        privilegedApp == true
          ? {
              list: privilegedApp == true ? Processes.list : null,
              get: privilegedApp == true ? Processes.get : null,
            }
          : null,
    };

    if (pkg.default.style) {
      let style = getCoreStyles();
      let styleHtml = style.getHtml();
      // I know this has a flaw due to it working like this,
      // a malicious package could technically break other apps' styles if it wanted to.
      // A better workaround for later would be to use an array of known packages.
      if (
        !styleHtml.includes(`/* Styles for ${pkgData.name} */`) &&
        typeof pkg.default.style === "string"
      )
        style.html(
          styleHtml +
            `\n\n/* Styles for ${pkgData.name} */\n\n${pkg.default.style}`
        );
    }

    pkg.default.start(PackageLib);

    return Processes.get(pid);
  },
  async Run(appID, args = [], denySecurity = false) {
    let appIDarr = appID.split(":");
    let appCategory = appIDarr[0];
    appIDarr.shift();
    let appIDstr = appIDarr.join(":");
    return Core.Packages.startFromURL(
      "/pkgs/" + appCategory + "/" + appIDstr + ".js",
      args,
      denySecurity
    );
  },
};

const Details = {
  version: "v2.0.0",
  codename: "Hydra",
};

Details.versionString = Details.version;
Details.minSupported = `<=${Details.version}`;

let Core = {
  Packages,
  Processes,
  Security,
  Details,
};

windowSystem.init(Core);

window.Core = Core;
window.RegisteredApps = RegisteredApps;

window.compatibility = compatibility;

Core.Packages.startFromURL("/pkgs/system/BootLoader.js", [], true);
