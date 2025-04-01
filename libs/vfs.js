const FILE_TYPE = {
  0: "File",
  1: "Folder",
  File: 0,
  Folder: 1,
};

// let templateFsLayout = {
//   Root: {
//     data: {
//       "README.md": {
//         data: "This is the root folder of your file system. You can create new folders and files here.",
//         metaData: {
//           created: Date.now(),
//           modified: Date.now(),
//           type: FILE_TYPE.File, // 0
//           owner: "root",
//           read: true,
//           write: true,
//         },
//       },
//     },
//     metaData: {
//       created: Date.now(),
//       modified: Date.now(),
//       type: FILE_TYPE.Folder, // 1
//       owner: "root",
//       read: true,
//       write: true,
//     },
//   },
// };

// let templateFsLayout = {
//   Registry: {},
//   Root: {
//     Pluto: {
//       panics: {
//         "README.MD":
//           "This folder is designed to help store logs when Pluto crashes. If you have any worries about the logs please contact us with them.",
//       },
//       config: {
//         "appearanceConfig.json": JSON.stringify({
//           wallpaper: "./assets/wallpapers/space.png",
//           useThemeWallpaper: true,
//           theme: "dark.theme",
//           sidebarType: "vertical",
//         }),
//         "settingsConfig.json": JSON.stringify({
//           warnSecurityIssues: true,
//         }),
//         themes: {
//           "light.theme":
//             '{"version":1,"name":"Light","description":"A built-in theme.","values":null,"cssThemeDataset":"light","wallpaper":"./assets/wallpapers/light.png"}',
//           "dark.theme":
//             '{"version":1,"name":"Dark","description":"A built-in theme.","values":null,"cssThemeDataset":"dark","wallpaper":"./assets/wallpapers/space.png"}',
//           "grey.theme":
//             '{"version":1,"name":"Grey","description":"A built-in theme.","values":null,"cssThemeDataset":"grey","wallpaper":"./assets/wallpapers/grey.svg"}',
//           "red.theme":
//             '{"version":1,"name":"Red","description":"A built-in theme.","values":null,"cssThemeDataset":"red","wallpaper":"./assets/wallpapers/red.png"}',
//           "green.theme":
//             '{"version":1,"name":"Green","description":"A built-in theme.","values":null,"cssThemeDataset":"green","wallpaper":"./assets/wallpapers/green.jpg"}',
//           "purple.theme":
//             '{"version":1,"name":"Purple","description":"A built-in theme.","values":null,"cssThemeDataset":"purple","wallpaper":"./assets/wallpapers/purple.svg"}',
//         },
//       },
//       apps: {
//         "README.MD":
//           "This folder contains all the apps that you have downloaded. If you have any questions about them please contact us.",
//       },
//       startup: "",
//     },
//     Desktop: {},
//     Documents: {},
//     Downloads: {},
//     Pictures: {},
//     Videos: {},
//     Music: {},
//   },
// };

let templateFsLayout = {
  Registry: {
    data: {
      libs: {
        data: {},
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
    },
    metaData: {
      created: Date.now(),
      modified: Date.now(),
      type: FILE_TYPE.Folder, // 1
      owner: "root",
      read: true,
      write: true,
    },
  },
  Root: {
    data: {
      "README.md": {
        data: "This is the root folder of your file system. You can create new folders and files here.",
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.File, // 0
          owner: "root",
          read: true,
          write: true,
        },
      },
      Pluto: {
        data: {
          panics: {
            data: {
              "README.MD": {
                data: "This folder is designed to help store logs when Pluto crashes. If you have any worries about the logs please contact us with them.",
                metaData: {
                  created: Date.now(),
                  modified: Date.now(),
                  type: FILE_TYPE.File, // 0
                  owner: "root",
                  read: true,
                  write: true,
                },
              },
            },
            metaData: {
              created: Date.now(),
              modified: Date.now(),
              type: FILE_TYPE.Folder, // 1
              owner: "root",
              read: true,
            },
          },
          config: {
            data: {
              "appearanceConfig.json": {
                data: JSON.stringify({
                  wallpaper: "./assets/wallpapers/space.png",
                  useThemeWallpaper: true,
                  theme: "dark.theme",
                  sidebarType: "vertical",
                }),
                metaData: {
                  created: Date.now(),
                  modified: Date.now(),
                  type: FILE_TYPE.File, // 0
                  owner: "root",
                  read: true,
                  write: true,
                },
              },
              "settingsConfig.json": {
                data: JSON.stringify({
                  warnSecurityIssues: true,
                }),
                metaData: {
                  created: Date.now(),
                  modified: Date.now(),
                  type: FILE_TYPE.File, // 0
                  owner: "root",
                  read: true,
                  write: true,
                },
              },

              themes: {
                data: {
                  "light.theme": {
                    data: '{"version":1,"name":"Light","description":"A built-in theme.","values":null,"cssThemeDataset":"light","wallpaper":"./assets/wallpapers/light.png"}',
                    metaData: {
                      created: Date.now(),
                      modified: Date.now(),
                      type: FILE_TYPE.File, // 0
                      owner: "root",
                      read: true,
                      write: true,
                    },
                  },
                  "dark.theme": {
                    data: '{"version":1,"name":"Dark","description":"A built-in theme.","values":null,"cssThemeDataset":"dark","wallpaper":"./assets/wallpapers/space3.png"}',
                    metaData: {
                      created: Date.now(),
                      modified: Date.now(),
                      type: FILE_TYPE.File, // 0
                      owner: "root",
                      read: true,
                      write: true,
                    },
                  },
                  "grey.theme": {
                    data: '{"version":1,"name":"Grey","description":"A built-in theme.","values":null,"cssThemeDataset":"grey","wallpaper":"./assets/wallpapers/grey.svg"}',
                    metaData: {
                      created: Date.now(),
                      modified: Date.now(),
                      type: FILE_TYPE.File, // 0
                      owner: "root",
                      read: true,
                      write: true,
                    },
                  },
                  "red.theme": {
                    data: '{"version":1,"name":"Red","description":"A built-in theme.","values":null,"cssThemeDataset":"red","wallpaper":"./assets/wallpapers/red.png"}',
                    metaData: {
                      created: Date.now(),
                      modified: Date.now(),
                      type: FILE_TYPE.File, // 0
                      owner: "root",
                      read: true,
                      write: true,
                    },
                  },
                  "green.theme": {
                    data: '{"version":1,"name":"Green","description":"A built-in theme.","values":null,"cssThemeDataset":"green","wallpaper":"./assets/wallpapers/green.jpg"}',
                    metaData: {
                      created: Date.now(),
                      modified: Date.now(),
                      type: FILE_TYPE.File, // 0
                      owner: "root",
                      read: true,
                      write: true,
                    },
                  },
                  "purple.theme": {
                    data: '{"version":1,"name":"Purple","description":"A built-in theme.","values":null,"cssThemeDataset":"purple","wallpaper":"./assets/wallpapers/purple.svg"}',
                    metaData: {
                      created: Date.now(),
                      modified: Date.now(),
                      type: FILE_TYPE.File, // 0
                      owner: "root",
                      read: true,
                      write: true,
                    },
                  },
                },
                metaData: {
                  created: Date.now(),
                  modified: Date.now(),
                  type: FILE_TYPE.Folder, // 1
                  owner: "root",
                  read: true,
                },
              },
            },
            metaData: {
              created: Date.now(),
              modified: Date.now(),
              type: FILE_TYPE.Folder, // 1
              owner: "root",
              read: true,
            },
          },
          apps: {
            data: {
              "README.MD": {
                data: "This folder contains all the apps that you have downloaded. If you have any questions about them please contact us.",
                metaData: {
                  created: Date.now(),
                  modified: Date.now(),
                  type: FILE_TYPE.File, // 0
                  owner: "root",
                  read: true,
                  write: true,
                },
              },
            },
            metaData: {
              created: Date.now(),
              modified: Date.now(),
              type: FILE_TYPE.Folder, // 1
              owner: "root",
              read: true,
            },
          },
          startup: {
            data: "",
            metaData: {
              created: Date.now(),
              modified: Date.now(),
              type: FILE_TYPE.File, // 0
              owner: "root",
              read: true,
              write: true,
            },
          },
        },
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
      Desktop: {
        data: {},
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
      Documents: {
        data: {},
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
      Downloads: {
        data: {},
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
      Pictures: {
        data: {},
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
      Videos: {
        data: {},
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
      Music: {
        data: {},
        metaData: {
          created: Date.now(),
          modified: Date.now(),
          type: FILE_TYPE.Folder, // 1
          owner: "root",
          read: true,
          write: true,
        },
      },
    },
    metaData: {
      created: Date.now(),
      modified: Date.now(),
      type: FILE_TYPE.Folder, // 1
      owner: "root",
      read: true,
      write: true,
    },
  },
};

const Vfs = {
  // The file system is represented as a nested object, where each key is a folder or file name
  // and the value is either a string (for file contents) or another object (for a subfolder)
  fileSystem: {},
  async save() {
    await localforage.setItem("newFS", JSON.stringify(this.fileSystem));
    this.fileSystem = JSON.parse(await localforage.getItem("newFS"));
  },
  async exportFS() {
    return this.fileSystem;
  },
  async importFS(fsObject = templateFsLayout) {
    if (fsObject === true) {
      this.fileSystem = templateFsLayout;
    } else if (
      !(await localforage.getItem("newFS")) &&
      fsObject === templateFsLayout
    ) {
      this.fileSystem = fsObject;
    } else if (fsObject !== templateFsLayout) {
      this.fileSystem = fsObject;
    } else {
      const existingFs = JSON.parse(await localforage.getItem("newFS"));

      // this.fileSystem = {...templateFsLayout, ...existingFs};
      this.fileSystem = existingFs;

      // this.fileSystem = { ...fsObject, ...this.fileSystem };
    }
    this.save();
    return this.fileSystem;
  },
  // Helper function to get the parent folder of a given path
  async getParentFolder(path) {
    const parts = path.split("/");
    parts.pop();
    return parts.join("/");
  },
  // function to tell you if stored data is a file or a folder
  async whatIs(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    let current = fsObject;
    let metaData;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        return null;
      }
      metaData = current[part].metaData;
      current = current[part].data;
    }
    return FILE_TYPE[metaData.type];
  },
  // Function to get the contents of a file at a given path
  async readFile(path, fsObject = this.fileSystem, bypass = false) {
    return new Promise(async (resolve, reject) => {
      const parts = path.split("/");
      let current = fsObject;
      let metaData;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (typeof current[part] === "undefined") {
          return resolve(null);
        }
        metaData = current[part].metaData;
        current = current[part].data;
      }
      if (metaData.read !== true) {
        return resolve(null);
      }
      if (typeof current !== "string") {
        return resolve(null);
      }
      if (bypass === false) {
        // special vfs import handler
        if (current.startsWith("vfsImport:")) {
          const vfsImportPath = current.substring(10);
          if (vfsImportPath === "fs")
            return resolve("vfsImportError:not-allowed");
          const item = await localforage.getItem(vfsImportPath);

          if (item !== null && item !== undefined) {
            if (item instanceof Blob) {
              if (item.size > 1024 * 1024 * 10) {
                return resolve(URL.createObjectURL(item));
              } else {
                let result = await new Promise((resolve, reject) => {
                  const reader = new FileReader();

                  reader.onload = function (e) {
                    return resolve(e.target.result);
                  };

                  reader.readAsDataURL(item);
                });
                return resolve(result);
              }
            } else {
              return resolve(item);
            }
          } else {
            return resolve("vfsImportFailed:" + vfsImportPath);
          }
        }
      }
      document.dispatchEvent(new CustomEvent("pluto.vfs-read"), {
        detail: { path },
      });
      return resolve(current);
    });
  },

  async createFile(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    const filename = parts.pop();
    let current = fsObject;
    let metaData;
    let toBeMetaData = {
      created: Date.now(),
      modified: Date.now(),
      type: FILE_TYPE.File, // 0
      owner: "root",
      read: true,
      write: true,
    };
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        current[part] = {};
      }
      metaData = current[part].metaData;
      current = current[part].data;
    }
    if (metaData.type !== FILE_TYPE.Folder) return null;
    if (metaData.write === false) return null;
    if (metaData.read === false) return null;
    if (current[filename]) return null;
    current[filename] = { data: "", metaData: toBeMetaData };
    this.save();
  },

  async writeFile(path, contents, fsObject = this.fileSystem) {
    try {
      if (typeof contents !== "string")
        throw new Error("Tried to write a non-string to a file.");
      const parts = path.split("/");
      const filename = parts.pop();
      let current = fsObject;
      let metaData;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (typeof current[part] === "undefined") {
          return null;
        }
        metaData = current[part].metaData;
        current = current[part].data;
      }

      if (metaData.type !== FILE_TYPE.Folder) return null;
      if (metaData.write === false) return null;
      if (metaData.read === false) return null;
      if (current[filename].metaData.type !== FILE_TYPE.File) return null;
      if (current[filename].metaData.write === false) return null;
      if (current[filename].metaData.read === false) return null;

      // if file has a special
      if (current[filename].data !== undefined) {
        // special vfs import handler
        if (current[filename].data.startsWith("vfsImport:")) {
          const vfsImportPath = current[filename].data.substring(10);
          if (vfsImportPath === "fs") return "vfsImportError:not-allowed";
          await localforage.setItem(vfsImportPath, contents);
        } else {
          current[filename].data = contents;
        }
      } else {
        // if file is bigger than 8kb then put it into the special bin
        if (contents.length > 8192) {
          const vfsImportPath = Math.random().toString(36).substring(2);
          if (vfsImportPath === "fs") return "vfsImportError:not-allowed";

          // save link to file
          await localforage.setItem(vfsImportPath, contents);
          current[filename].data = `vfsImport:${vfsImportPath}`;
        } else {
          // save normally
          current[filename].data = contents;
        }
      }

      current[filename].metaData.modified = Date.now();
      this.save();
      document.dispatchEvent(new CustomEvent("pluto.vfs-write"), {
        detail: { path, contents },
      });
      return contents;
    } catch (e) {
      Vfs.createFile(path, fsObject);
      Vfs.writeFile(path, contents, fsObject);
    }
  },

  // Function to create a new folder at a given path
  async createFolder(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    const foldername = parts.pop();
    let current = fsObject;
    let metaData;
    let toBeMetaData = {
      created: Date.now(),
      modified: Date.now(),
      type: FILE_TYPE.Folder, // 1
      owner: "root",
      read: true,
      write: true,
    };
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        current[part] = {};
      }
      metaData = current[part].metaData;
      current = current[part].data;
    }
    if (metaData.type !== FILE_TYPE.Folder) return null;
    if (metaData.write === false) return null;
    if (metaData.read === false) return null;
    if (!current[foldername])
      current[foldername] = {
        data: {},
        metaData: toBeMetaData,
      };
    this.save();
  },

  // async delete(path, fsObject = this.fileSystem) {
  //   const parts = path.split("/");
  //   const filename = parts.pop();
  //   const parentPath = this.getParentFolder(path);
  //   let parent = fsObject;
  //   for (let i = 0; i < parts.length; i++) {
  //     const part = parts[i];
  //     if (typeof parent[part] === "undefined") {
  //       return;
  //     }
  //     parent = parent[part];
  //   }

  //   // maybe use readFile here so we don't
  //   // accidentally delete the key "fs"
  //   const tmp = String(await this.readFile(path, this.fileSystem, true));
  //   console.log(tmp);
  //   // if it's an import then handle it specially
  //   if (tmp.startsWith("vfsImport:")) {
  //     const tmpName = tmp.substring(10);
  //     await localforage.removeItem(tmpName);

  //     this.log(`Deleted reference file "${tmpName}"`);
  //   }

  //   delete parent[filename];

  //   this.save("delete " + path);

  //   document.dispatchEvent(new CustomEvent("pluto.vfs-delete"), {
  //     detail: { path },
  //   });
  // },
  // Function to delete a file or folder at a given path
  async delete(path, fsObject = this.fileSystem) {
    const tmp = String(await this.readFile(path, this.fileSystem, true));
    const parts = path.split("/");
    const filename = parts.pop();
    let parent = fsObject;
    let metaData;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof parent[part] === "undefined") {
        return;
      }
      metaData = parent[part].metaData;
      parent = parent[part].data;
    }
    // maybe use readFile here so we don't
    // accidentally delete the key "fs"

    // if it's an import then handle it specially
    if (tmp.startsWith("vfsImport:")) {
      const tmpName = tmp.substring(10);
      await localforage.removeItem(tmpName);

      console.log(`Deleted reference file "${tmpName}"`);
    }
    metaData.modified = Date.now();
    delete parent[filename];
    this.save();
  },
  // Function to list all files and folders at a given path
  async list(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    let current = fsObject;
    let metaData;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        return null;
      }
      metaData = current[part].metaData;
      current = current[part].data;
    }
    if (metaData.type !== FILE_TYPE.Folder) return null;
    if (metaData.read === false) return null;
    if (metaData.write === false) return null;
    const result = await Promise.all(
      Object.keys(current).map(async (m) => {
        return {
          item: m,
          type: await this.whatIs(path + "/" + m),
          metaData: current[m].metaData,
        };
      })
    );
    return result;
  },
  async exists(path, fsObject = this.fileSystem) {
    const parts = path.split("/");
    let current = fsObject;
    let metaData;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        return false;
      }
      metaData = current[part].metaData;
      current = current[part].data;
    }
    // if (metaData.type !== FILE_TYPE.Folder) return false
    if (metaData.read === false) return false;
    if (metaData.write === false) return false;
    return true;
  },
  async merge(fsObject = this.fileSystem) {
    var existingFs = fsObject;

    function mergeFileSystem(obj1, obj2) {
      for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          if (
            typeof obj2[key] === "object" &&
            obj2[key] !== null &&
            !Array.isArray(obj2[key])
          ) {
            if (
              !(key in obj1) ||
              typeof obj1[key] !== "object" ||
              obj1[key] === null ||
              Array.isArray(obj1[key])
            ) {
              obj1[key] = {}; // Create an object if the key doesn't exist or if it is not an object
            }
            mergeFileSystem(obj1[key], obj2[key]); // Recursive call for nested objects
          } else {
            if (!(key in obj1)) {
              obj1[key] = obj2[key]; // Assign the value if the key doesn't exist in obj1
            } else {
              console.log(
                `File "${key}" already exists and will not be overwritten.`
              );
            }
          }
        }
      }
    }

    mergeFileSystem(existingFs, templateFsLayout);
    this.importFS(existingFs);
    this.save();
  },
};

export default Vfs;
