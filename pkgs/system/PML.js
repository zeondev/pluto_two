// function makeid(length) {
//   var result = "";
//   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

// let appName = "";

// async function readAndRunPmlFile(data, wrapper, PMLWindow) {
//   let file = data;

//   console.log(wrapper);

//   wrapper.id = makeid(16);
//   console.log("there is xml content", file);
//   var parser = new DOMParser();
//   var xmlDoc = parser.parseFromString(file, "text/xml");
//   console.log(xmlDoc.documentElement);
//   for (let i = 0; i < xmlDoc.documentElement.children.length; i++) {
//     if (xmlDoc.documentElement.children[i].tagName == "info") {
//       console.log("info found", xmlDoc.documentElement.children[i]);
//       console.log(xmlDoc.documentElement.children[i].innerHTML);
//       for (
//         let j = 0;
//         j < xmlDoc.documentElement.children[i].children.length;
//         j++
//       ) {
//         if (xmlDoc.documentElement.children[i].children[j].tagName == "title") {
//           console.log(
//             "title found",
//             xmlDoc.documentElement.children[i].children[j]
//           );
//           appTitle =
//             xmlDoc.documentElement.children[i].children[j].textContent.trim();

//           PMLWindow.setTitle(appTitle);
//           appName = appTitle;
//         }
//       }
//     } else if (xmlDoc.documentElement.children[i].tagName == "content") {
//       console.log("content found", xmlDoc.documentElement.children[i]);
//       wrapper.innerHTML = ""; // clean it
//       wrapper.insertAdjacentHTML(
//         "beforeend",
//         xmlDoc.documentElement.children[i].innerHTML
//       );
//     } else if (xmlDoc.documentElement.children[i].tagName == "script") {
//       console.log("script found", xmlDoc.documentElement.children[i]);
//       console.log(xmlDoc.documentElement.children[i].innerText);
//       var scriptText = xmlDoc.documentElement.children[i].textContent;

//       // Clean the script
//       scriptText = scriptText.replace(/#this/g, "#" + wrapper.id);
//       console.log("script", scriptText);
//       let scriptElm = document.createElement("script");
//       wrapper.appendChild(scriptElm);
//       scriptElm.innerHTML = scriptText;
//     } else if (xmlDoc.documentElement.children[i].tagName == "style") {
//       console.log("style found", xmlDoc.documentElement.children[i]);
//       console.log(xmlDoc.documentElement.children[i].innerText);
//       var styleText = xmlDoc.documentElement.children[i].textContent;

//       // Clean the style
//       styleText = styleText.replace(/#this/g, "#" + wrapper.id);
//       console.log("style", styleText);
//       let styleElm = document.createElement("style");
//       wrapper.appendChild(styleElm);
//       styleElm.innerHTML = styleText;
//     }
//   }
// }

// import Html from "../../libs/html.js";
// import Ws from "/libs/windowSystem.js";
// import compatibility from "/libs/compatibility.js";
// import Vfs from "../../libs/vfs.js";

// let myWindow;

// const pkg = {
//   name: appName,
//   type: "app",
//   privs: 0,
//   start: async function (Root) {

//   },
//   end: async function () {
//     // Close the window when the process is exited
//     myWindow.close();
//   },
// };

// export default pkg;
