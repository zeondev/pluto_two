import Vfs from "./vfs.js";
Vfs.importFS();

export default {
  async importFile(path) {
    let file = await Vfs.readFile(path);
    let imported = await import("data:text/javascript;base64," + btoa(file));
    return imported.default;
  },
};
