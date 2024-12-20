import Vfs from "./vfs.js";
await Vfs.importFS();

export default {
  name: "Code Scanner",
  description: "Scans application files for dangerous code.",
  ver: "v1.6.2", // Supports minimum Core version of v1.6.2
  type: "library",

  // exported functions here
  isCodeDangerous(code) {
    const dangerousKeywords = [
      "eval",
      "document.write",
      "localStorage",
      "sessionStorage",
      "localforage",
    ];

    for (const keyword of dangerousKeywords) {
      if (code.includes(keyword)) {
        return true;
      }
    }

    return false;
  },
  async scanFolder(folder = "Root") {
    const list = []; // Create an empty array to store the results

    async function scanSubFolder(folder) {
      // Create a helper function for recursive calls
      const fileList = await Vfs.list(folder);

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const filePath = `${folder}/${file.item}`;
        const fileType = file.type;

        if (fileType === "File") {
          try {
            const fileContent = await Vfs.readFile(filePath);
            const result = {
              success: true,
              filename: file.item,
              path: folder,
              content: fileContent,
            };
            list.push(result);
            // console.log(result);
          } catch (error) {
            const result = {
              success: false,
              filename: file.item,
              path: folder,
              content: error,
            };
            list.push(result);
            // console.log(result);
          }
        } else if (fileType === "Folder") {
          await scanSubFolder(filePath); // Recursive call to scan subfolder
        }
      }
    }

    await scanSubFolder(folder); // Initial call to start scanning the root folder

    return list; // Return the list for further processing if needed
  },

  getFileExtension(filename) {
    const parts = filename.split(".");
    if (parts.length > 1) {
      return parts[parts.length - 1];
    } else {
      return filename;
    }
  },
  async scanForDangerousCode() {
    let list = [];
    let allFiles = await this.scanFolder();
    // console.log(allFiles);
    for (let i = 0; i < allFiles.length; i++) {
      if (allFiles[i].success === false) {
        //   Root.Modal.alert("Failed", "Failed to scan " + allFiles[i].filename);
        //   return false;
        list.push({
          success: false,
          path: allFiles[i].path,
          filename: allFiles[i].filename,
        });
      } else {
        if (this.getFileExtension(allFiles[i].filename) === "app") {
          let icd = this.isCodeDangerous(allFiles[i].content);
          if (icd == true) {
            //   let prompt = await Root.Modal.prompt(
            //     "Danger",
            //     "Dangerous code detected in " +
            //       allFiles[i].filename +
            //       ".<br>Do you want to Delete it?"
            //   );
            //   console.log(prompt);
            //   if (prompt == true) {
            //     await Vfs.delete(allFiles[i].path + "/" + allFiles[i].filename);
            //   }
            //     await Vfs.delete(allFiles[i].path + "/" + allFiles[i].filename);
            list.push({
              success: true,
              path: allFiles[i].path,
              filename: allFiles[i].filename,
              dangerous: true,
              delete: async () => {
                await Vfs.delete(allFiles[i].path + "/" + allFiles[i].filename);
              },
            });
          } else {
            list.push({
              success: true,
              path: allFiles[i].path,
              filename: allFiles[i].filename,
              dangerous: false,
            });
          }
        }
      }
    }
    return list;
  },
};
