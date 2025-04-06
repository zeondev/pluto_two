import Vfs from "../vfs.js";

await Vfs.importFS();

let lang = (await Vfs.readFile("Root/Pluto/config/language")) || "en_US";
let strings = {};

try {
  await Vfs.createFile("Root/Pluto/config/language");
  let languageModule = (await import(`./${lang}.js`)).default;
  await Vfs.writeFile("Root/Pluto/config/language", lang);
  strings = languageModule;
} catch (e) {
  console.log("error");
}

const langManager = {
  langs: ["en_US", "en_GB", "fr_FR", "es_ES", "de_DE", "pt_PT", "fil_PH"],
  async setLanguage(lang) {
    try {
      let languageModule = (await import(`./${lang}.js`)).default;
      await Vfs.writeFile("Root/Pluto/config/language", lang);
      strings = languageModule;
    } catch (e) {
      console.error("Failed to load strings!", e);
    }
    window.strings = strings;
    document.dispatchEvent(
      new CustomEvent("pluto.lang-change", { detail: lang })
    );
  },
  getLanguage() {
    return lang;
  },
  getLanguageDisplayName() {
    return lang["languages"][lang];
  },
  getString(path, replacements = {}) {
    const parts = path.split(".");
    let current = strings;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof current[part] === "undefined") {
        return path;
      }
      current = current[part];
    }
    if (typeof current === "string") {
      for (const key in replacements) {
        current = current.replace(`%${key}%`, replacements[key]);
      }
    }
    if (current === null || current === undefined) {
      return path;
    }
    return current;
  },
};
window.langManager = langManager;

export default langManager;
