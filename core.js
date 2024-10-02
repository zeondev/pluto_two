"use strict";

import compatibility from "./libs/compatibility.js";

let Security = {
  check: (pkgData) => {
    return confirm(
      "This package " +
        pkgData.name +
        " requires elevated privileges. Do you want to continue?"
    );
  },
};

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

    if (!denySecurity) {
      if (pkgData.privs === 1) {
        let securityAccept = Security.check(pkgData);
        if (securityAccept) {
          privilegedApp = true;
        }
      } else {
        privilegedApp = pkgData.privs === 1 ? true : false;
      }
    }

    console.log(privilegedApp);

    const pid = Processes.findEmptyPid();
    Processes.add(pid, {
      pid,
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
      Processes:
        privilegedApp == true
          ? {
              list: privilegedApp == true ? Processes.list : null,
              get: privilegedApp == true ? Processes.get : null,
            }
          : null,
    };

    pkg.default.start(PackageLib);

    return Processes.get(pid);
  },
  Run(appID) {
    
  },
};

let Core = {
  Packages,
  Processes,
  Security,
};

window.Core = Core;

// document.body.appendChild(
//   compatibility.start(
//     await fetch("/compatibility/pkgs/apps/AppStore.js").then((r) => r.text())
//   )
// );

window.compatibility = compatibility;
