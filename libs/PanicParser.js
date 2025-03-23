import Vfs from "./vfs.js";

export default {    // exported functions here
    async scanPanicFolder() {
      let folder = "Root/Pluto/panics";
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

      // console.log(list); // Print the final list once finished

      // Only include the .panic files
      let endlist = list.filter((file) => file.filename.endsWith(".panic"));

      return endlist; // Return the list for further processing if needed
    },
};
